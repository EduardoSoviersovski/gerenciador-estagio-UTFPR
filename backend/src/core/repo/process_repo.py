GET_INTERNSHIP_TYPE_ID = "SELECT id FROM internship_type WHERE name = UPPER(%s)"

INSERT_INTERNSHIP_PROCESS = """
INSERT INTO internship_process (
    student_id,
    advisor_id,
    company_id,
    status_id,
    student_course_id,
    internship_type_id,
    sei_number,
    start_date,
    weekly_hours
)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

GET_INTERNSHIP_PROCESS = """
SELECT
    student_id,
    advisor_id,
    company_id,
    status_id,
    student_course_id,
    internship_type_id,
    sei_number,
    start_date,
    weekly_hours
FROM internship_process
WHERE id = %s
"""

GET_INTERNSHIP_PROCESS_BY_STUDENT_ID_AND_START_DATE = """
SELECT
    id,
    student_id,
    advisor_id,
    company_id,
    status_id,
    student_course_id,
    internship_type_id,
    sei_number,
    start_date,
    weekly_hours
FROM internship_process
WHERE student_id = %s
    AND start_date = %s
"""

GET_ACTIVE_HOUR_GOAL_BY_PROCESS_ID = """
SELECT id, process_id, total_target_hours, end_date_forecast 
FROM hour_goal 
WHERE process_id = %s AND is_active = TRUE
"""

INSERT_HOUR_GOAL = """
INSERT INTO hour_goal (process_id, total_target_hours, end_date_forecast, is_active) 
VALUES (%s, %s, %s, 1)
"""

UPDATE_HOUR_GOAL_INACTIVE = "UPDATE hour_goal SET is_active = FALSE WHERE process_id = %s"

UPDATE_INTERNSHIP_PROCESS = """
UPDATE internship_process SET sei_number=%s, start_date=%s, weekly_hours=%s, internship_type_id=%s WHERE id=%s
"""

DELETE_INTERNSHIP_PROCESS = """
DELETE FROM internship_process 
WHERE id = %s
"""

UPDATE_HOUR_GOAL = """
UPDATE hour_goal 
SET total_target_hours = %s, 
    end_date_forecast = %s 
WHERE process_id = %s AND is_active = 1
"""

DELETE_HOUR_GOALS_BY_PROCESS = """
DELETE FROM hour_goal 
WHERE process_id = %s
"""