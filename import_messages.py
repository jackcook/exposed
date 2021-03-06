import argparse, datetime, os, sqlite3, time
from bs4 import BeautifulSoup

def import_messages(filename):
    if os.path.isfile("data.db"):
        os.remove("data.db")

    db = sqlite3.connect("data.db")
    c = db.cursor()

    c.execute("create table if not exists messages (id integer primary key, message text, sender text, time integer);")

    import_file = open(filename, "r")

    print "Created local SQLite database"
    print "Parsing messages HTML..."

    soup = BeautifulSoup(import_file.read(), "html.parser")
    threads = soup.findAll("div", {"class": "thread"})
    threads.reverse()

    owner_name = soup.title.text.replace(" - Messages", "")

    print "Finished parsing messages HTML"

    for (i, thread) in enumerate(threads):
        names = str(thread).split(">")[1].split("<")[0].split(", ")

        if len(names) > 2 or owner_name not in names:
            continue

        name = (names[1] if names[0] == owner_name else names[0]).lower().replace(" ", "_")

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
            time_obj = datetime.datetime.strptime(time_text, "%A, %B %d, %Y at %I:%M%p %Z")
            timestamp = int(time.mktime(time_obj.timetuple()))

            c.execute("insert into %s (message, sender, time) values (?, ?, ?);" % name, (message, sender, timestamp))
            c.execute("insert into messages (message, sender, time) values (?, ?, ?);", (message, sender, timestamp))

        print "Imported messages with %s" % name

    print "Finished importing all messages"

    db.commit()
    db.close()

    import_file.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--filename")
    args = parser.parse_args()

    filename = "messages.htm" if args.filename == None else args.filename
    import_messages(filename)
