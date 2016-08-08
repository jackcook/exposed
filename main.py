import argparse
from import_messages import import_messages
from statistics import generate_data

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--filename")
    args = parser.parse_args()

    filename = "messages.htm" if args.filename == None else args.filename
    import_messages(filename)
    generate_data("data.db")
