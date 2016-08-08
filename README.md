# Exposed

Exposed is a Python script that generates a website revealing your Facebook message statistics.
It has not been tested on Windows, but everything below should work on UNIX-based systems (macOS, Linux).

## Installation

After making sure you're using Python 2.7 and you have pip installed, run the following command to install all dependencies:

```
$ sudo pip install -r requirements.txt
```

## Usage

Download your Facebook archive by following the instructions detailed in the [Facebook Help Center](https://www.facebook.com/help/131112897028467/).
It should email you with a download link within about half an hour.

Once this is done, drag `messages.htm` from your Facebook archive into the same directory that you've cloned this repository into.
Then, run the following command:

```
$ python main.py
```

It should generate all data files along with an `index.html` file.

If you're using Safari, you should be able to open `index.html` and experience no issues.
If you're using Google Chrome, due to CORS issues, this will not work.

To fix this for Chrome, while in the same directory as `index.html`, run the following command:

```
$ python -m SimpleHTTPServer
```

Once it starts, you should then be able to navigate to [http://localhost:8000](http://localhost:8000) to view your Messenger statistics.

## Authors

Exposed was built by [Jack Cook](http://jackcook.nyc) and Stephanie Chow in under 24 hours at [MLH Prime](https://prime.mlh.io).

## License

Exposed is available under the MIT license. See the LICENSE file for details.
