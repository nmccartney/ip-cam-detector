# -*- encoding: utf-8 -*-

"""
new app
"""

from api import app, db


@app.shell_context_processor
def make_shell_context():
    return {"app": app,
            "db": db
            }


if __name__ == '__main__':
    app.run(debug=False, host="0.0.0.0")