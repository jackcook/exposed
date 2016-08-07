from bs4 import BeautifulSoup
from datetime import datetime
import sqlite3
import time

db = sqlite3.connect("data.db")
c = db.cursor()

import_file = open("messages.htm", "r")

soup = BeautifulSoup(import_file.read(), "html.parser")
threads = soup.findAll("div", {"class": "thread"})

for (i, thread) in enumerate(threads):
    names = str(thread).split(">")[1].split("<")[0].split(", ")

    if len(names) > 2:
        continue

    name = (names[1] if names[0] == "Jack Cook" else names[0]).lower().replace(" ", "_")

    if "@facebook.com" in name:
        continue

    messages_data = thread.findAll("div", {"class": "message_header"})
    messages_text = thread.findAll("p")

    try:
        c.execute("create table if not exists %s (id integer primary key, message text, sender text, time integer);" % name)
    except:
        continue

    for j in range(0, len(messages_data)):
        message = messages_text[j].text
        sender = messages_data[j].findAll("span", {"class": "user"})[0].text

        time_text = messages_data[j].findAll("span", {"class": "meta"})[0].text
        time_obj = datetime.strptime(time_text, "%A, %B %d, %Y at %H:%M%p %Z")
        timestamp = int(time.mktime(time_obj.timetuple()))

        c.execute("insert into %s (message, sender, time) values (?, ?, ?);" % name, (message, sender, timestamp))

db.commit()
db.close()

import_file.close()
