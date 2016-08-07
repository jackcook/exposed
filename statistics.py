import datetime, operator, os, sqlite3, sys
from jinja2 import Template

db = sqlite3.connect("data.db")

def get_people():
    cur = db.cursor()
    cur.execute("select name from sqlite_master where type='table'")
    tables = [row[0] for row in cur.fetchall()]
    tables.remove("messages")

    people = []

    for table in tables:
        cur.execute("select Count(*) from %s" % table)
        messages = cur.fetchall()[0][0]

        people.append((table, messages))

    people.sort(key=lambda tup: tup[1])
    people.reverse()

    return people

def get_messages(name):
    cur = db.cursor()
    cur.execute("select * from %s" % name)
    return cur.fetchall()

def generate_emoticons(name):
    emoticons = [":)", ":P", ":D", "-_-", ":3", ";)", "D:", "<3", ":')", ":'(", ":("]

    messages = get_messages(name)
    words = {}

    for message in messages:
        message_words = message[1].split(" ")

        for word in message_words:
            if word not in emoticons: continue
            if word not in words:
                words[word] = 1
            else:
                words[word] += 1

    sorted_words = sorted(words.items(), key=operator.itemgetter(1))
    sorted_words.reverse()

    output = file("emojis_%s.csv" % name, "w+")
    output.write("emoticon,instances\n")

    for word in sorted_words[:6]:
        output.write("%s,%d\n" % (word[0], word[1]))

    output.close()

def count_messages(name):
    messages = get_messages(name)
    counts = {"Total": 0}

    for message in messages:
        if message[2] not in counts:
            counts[message[2]] = 1
        else:
            counts[message[2]] += 1

        counts["Total"] += 1

    return counts

def count_conversations(name):
    messages = get_messages(name)
    messages.reverse()

    last_sender = ""
    last_time = 0

    first = {}
    last = {}

    for message in messages:
        if message[3] > last_time + 900:
            if message[2] not in first:
                first[message[2]] = 1
            else:
                first[message[2]] += 1

            if last_sender not in last:
                last[last_sender] = 1
            else:
                last[last_sender] += 1

        last_sender = message[2]
        last_time = message[3]

    return (first, last)

def generate_calendar(name):
    messages = get_messages(name)

    dates = {}

    for message in messages:
        date = datetime.datetime.fromtimestamp(int(message[3])).strftime("%Y-%m-%d")

        if date not in dates:
            dates[date] = 1
        else:
            dates[date] += 1

    output = file("dates_%s.csv" % name, "w+")
    output.write("Date,Messages\n")

    for date in dates:
        output.write("%s,%d\n" % (date, dates[date]))

    output.close()

def generate_line_chart(name):
    messages = get_messages(name)
    messages.reverse()

    dates = []
    messages_num = {}
    total = 0

    for message in messages:
        total += 1
        date = datetime.datetime.fromtimestamp(int(message[3])).strftime("%Y-%m-%d")

        if date not in messages_num:
            messages_num[date] = total + 1
        else:
            messages_num[date] += 1

        if date not in dates:
            dates.append(date)

    output = file("line_%s.tsv" % name, "w+")
    output.write("date	messages\n")

    for date in dates:
        output.write("%s	%d\n" % (date, messages_num[date]))

    output.close()

def generate_index():
    template_file = open("template.html", "r")
    t = Template(template_file.read())

    friends = []

    for person in get_people():
        name = person[0].replace("_", " ").title()
        friends.append({"id": person[0], "name": name, "score": "Messages: %d" % person[1]})

    index_file = open("index.html", "w+")
    index_file.write(t.render(friends=friends).encode("utf-8"))

    index_file.close()
    template_file.close()

def generate_data():
    for person in get_people():
        generate_emoticons(person[0])
        generate_calendar(person[0])

    generate_index()

generate_data()
