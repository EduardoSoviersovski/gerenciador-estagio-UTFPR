GET_HOLIDAY_COUNT_IN_PERIOD = """
    SELECT COUNT(*) as num_holidays
    FROM holiday 
    WHERE date BETWEEN %s AND %s;
"""
