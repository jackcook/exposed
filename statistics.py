import datetime, operator, sqlite3, sys

db = sqlite3.connect("data.db")

def get_messages(name):
    cur = db.cursor()
    cur.execute("select * from %s" % name)
    return cur.fetchall()

def count_emojis(name):
    ignored_words = [":)", ":P", ":D", "-_-", ":3", ";)", "D:", "<3", ":')", ":'(", ":("]

    messages = get_messages(name)
    words = {}

    for message in messages:
        message_words = message[1].split(" ")

        for word in message_words:
            if word not in ignored_words: continue

            if word not in words:
                words[word] = 1
            else:
                words[word] += 1

    sorted_words = sorted(words.items(), key=operator.itemgetter(1))
    sorted_words.reverse()

    return sorted_words[:10]

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

for word in find_most_used_words(sys.argv[1]):
    print "%s: %d" % (word[0], word[1])
