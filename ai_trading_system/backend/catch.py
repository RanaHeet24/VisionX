import sys
import traceback

try:
    import app
except Exception as e:
    with open("error_log.txt", "w") as f:
        f.write(traceback.format_exc())
