import json
from datetime import datetime

""""
THIS FORMATTER TAKES THE VALUE FROM https://feriados.dev/ API AND FILTERS THE HOLIDAYS TO RETURN ONLY THE ONES 
THAT ARE NATIONAL, OR STATE HOLIDAYS IN PARANÁ, OR MUNICIPAL HOLIDAYS IN CURITIBA.

curl -H "X-API-Key: SUA_API_KEY" "https://api.feriados.dev/v1/holidays/year/2026"
"""

def filter_specific_holidays(json_data):
    filtered_holidays = []

    holidays_array = json_data.get("data", [])

    for holiday in holidays_array:
        holiday_type = holiday.get("type")
        locations = holiday.get("locations") or []

        is_national = (holiday_type == "national")

        is_parana = False
        if holiday_type == "state":
            for loc in locations:
                if loc.get("stateCode") == "PR":
                    is_parana = True
                    break

        is_curitiba = False
        if holiday_type == "municipal":
            for loc in locations:
                if loc.get("code") == "PR-curitiba":
                    is_curitiba = True
                    break

        if is_national or is_parana or is_curitiba:
            filtered_holidays.append({
                "name": f"{holiday.get("name")} - {holiday.get("description")}",
                "date": holiday.get("date"),
                "type": holiday_type
            })

    return filtered_holidays


def filter_weekday_holidays(holidays_list):
    weekday_holidays = []
    SATURDAY = 5
    for holiday in holidays_list:
        date_str = holiday["date"][:10]
        dt = datetime.strptime(date_str, "%Y-%m-%d")

        if dt.weekday() < SATURDAY:
            holiday["date"] = date_str
            weekday_holidays.append(holiday)

    return weekday_holidays


def generate_sql_insert(filtered_holidays, table_name="holiday"):
    if not filtered_holidays:
        return "-- Nenhum feriado encontrado."

    sql_lines = [f"INSERT INTO {table_name} (date, description) VALUES"]

    values = []
    for holiday in filtered_holidays:
        date_str = holiday['date'].split('T')[0]

        description = holiday['name'].replace("'", "''")

        values.append(f"('{date_str}', '{description}')")

    sql_lines.append(",\n".join(values) + ";")
    return "\n".join(sql_lines)


with open('holidays_from_2026.json', 'r', encoding='utf-8') as file:
    raw_data = json.load(file)
    results = filter_specific_holidays(raw_data)
    week_day_holidays = filter_weekday_holidays(results)
    sql_query = generate_sql_insert(week_day_holidays)
