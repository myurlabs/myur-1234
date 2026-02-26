from flask import Flask, render_template, request, redirect, jsonify, send_from_directory
import smtplib
from email.message import EmailMessage

# AI import
from openai import OpenAI

app = Flask(__name__, static_folder="public", template_folder="templates")

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('public', 'favicon.ico')

# ==============================
# EMAIL CONFIG (KEEP SAME)
# ==============================
SENDER_EMAIL = "md9763090@gmail.com"
APP_PASSWORD = "nnpzsxtvbhesuuhm"


# ==============================
# NVIDIA AI CONFIG
# ==============================
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="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"
)


# ==============================
# HOME PAGE
# ==============================
@app.route('/')
def home():
    return render_template('index.html')

# ==============================
# CV VIEW PAGE ROUTE (ADD THIS)
# ==============================
@app.route("/cv-view")
def cv_view():
    return render_template("cv_view.html")


# ==============================
# CV VIEW ROUTE (NEW)
# ==============================
from flask import send_from_directory, Response

@app.route("/cv")
def cv():
    response = send_from_directory(
        "public",
        "cv.pdf",
        as_attachment=False
    )

    response.headers["Content-Disposition"] = "inline; filename=cv.pdf"
    return response


# ==============================
# CONTACT FORM EMAIL ROUTE
# ==============================
@app.route('/send', methods=['POST'])
def send():

    name = request.form['name']
    email = request.form['email']
    message = request.form['message']

    msg = EmailMessage()
    msg['Subject'] = f'New Message from {name}'
    msg['From'] = SENDER_EMAIL
    msg['To'] = SENDER_EMAIL

    msg.set_content(
        f"Name: {name}\n"
        f"Email: {email}\n\n"
        f"Message:\n{message}"
    )

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.send_message(msg)
        server.quit()

        return redirect('/')

    except Exception as e:
        return f"Email Error: {e}"


# ==============================
# AI CHAT ROUTE
# ==============================
@app.route("/chat", methods=["POST"])
def chat():

    user_message = request.json.get("message")

    try:

        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are Myur AI, the official AI assistant of Myur Devraj, "
                        "a software developer, web developer, and technology entrepreneur.\n\n"

                        "Rules:\n"
                        "• Reply in the SAME language as the user.\n"
                        "• Give clear, clean, professional, and easy-to-understand answers.\n"
                        "• Use short paragraphs or bullet points when helpful.\n"
                        "• Avoid messy or confusing replies.\n"
                        "• If asked who created you, reply: I was developed by Myur Devraj.\n"
                        "• If you do not know something, reply: Please contact Myur Devraj using the contact form on this website.\n"
                        "• Always remain respectful and professional.\n"
                        "• Never say anything negative about Myur Devraj.\n\n"

                        "About Myur Devraj:\n"
                        "Myur Devraj is a Computer Science and Engineering student, "
                        "software and web developer specializing in Python, Flask, "
                        "WordPress, automation, and AI-powered applications."
                    )
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],

            temperature=0.5,
            max_tokens=400
        )

        reply = completion.choices[0].message.content

        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"reply": str(e)})


# ==============================
# RUN SERVER
# ==============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)