from subprocess import run, PIPE, Popen
from platform import uname, python_version, architecture, version
from sys import exit
from urllib import request
from json import loads
import tarfile
from os import makedirs, remove, rmdir,geteuid, environ
from shutil import move, rmtree
from os.path import expanduser

OS=""
SCARB_VERSIONS_DOWNLOAD_MAP = {}
DOJO_VERSIONS_DOWNLOAD_MAP = {}
SCARB_ADAPTED_OS = ""
DOJO_ADAPTED_OS = ""
DOJOUP_BIN_URL = "https://raw.githubusercontent.com/dojoengine/dojo/main/dojoup/dojoup"
USER_HOME_DIR = expanduser('~')
INSTALL_DIR = f"{USER_HOME_DIR}/.dojo_tools/"
USER_PROFILE = f"{USER_HOME_DIR}/.profile"
LINUX_ENV = f'PATH="$PATH:{INSTALL_DIR}dojo:{INSTALL_DIR}scarb/bin"'


makedirs(INSTALL_DIR, exist_ok=True)
makedirs(f"{INSTALL_DIR}dojo/", exist_ok=True)


def check_root():
    if geteuid() != 0:
        print("This program must be run as root. Aborting.")
        exit(1)


def check_curl():
    result = run_command("curl -V", FileNotFoundError)
    if result:
        for i in result.split(" "):
            if i.startswith("libcurl/"):
                curl_version = i.split("/")[1]
                print(f"Your curl version is {curl_version}")
                return curl_version
    else:
        print("Please install curl.")
        exit(1)

def check_os():
    global OS
    os_name=uname().system
    if os_name in ("Linux","Ubuntu","CentOS"):
        OS="Linux"
    elif os_name in ("Darwin"):
        OS="macOS"
    else:
        print("This script does not support your OS.")
        exit(1)
    


def check_git():
    result = run_command("git --version", FileNotFoundError)
    if result:
        git_version = result.split(" ")[-1]
        print(f"Your git version is {git_version}")
        return git_version
    else:
        print("Please install git.")
        exit(1)


def run_command(command: str, exception: Exception):
    command_list = command.split(" ")
    try:
        result = run(command_list, stdout=PIPE)
        if result.returncode == 0:
            return result.stdout.decode()
        else:
            return None
    except exception as e:
        return False


def get_scarb_latest_release_version():
    resp = request.urlopen(
        "https://api.github.com/repos/software-mansion/scarb/releases/latest")
    data = loads(resp.read())
    if data:
        for asset in data["assets"]:
            SCARB_VERSIONS_DOWNLOAD_MAP[asset["name"]
                                        ] = asset["browser_download_url"]
        return data["tag_name"]
    else:
        return None


def get_scarb_adapted_linux_os(latest_version: str):
    global SCARB_ADAPTED_OS
    SCARB_ADAPTED_OS = f"scarb-{latest_version}-{uname().machine}-unknown-linux-gnu.tar.gz"


def download_latest_scarb_version():
    scarb_latest_release_version = get_scarb_latest_release_version()
    if scarb_latest_release_version:
        get_scarb_adapted_linux_os(
            scarb_latest_release_version)

        download_url = SCARB_VERSIONS_DOWNLOAD_MAP.get(
            SCARB_ADAPTED_OS)
        file_path = downloader(
            download_url, SCARB_ADAPTED_OS)
        print("File Path:", file_path)


def download_latest_dojo_version():
    file_download_map = {}
    resp = request.urlopen(
        "https://api.github.com/repos/dojoengine/dojo/releases/latest")
    data = loads(resp.read())
    if data:
        for asset in data["assets"]:
            file_download_map[asset["name"]
                              ] = asset["browser_download_url"]
        # print("File download map:", file_download_map)
        global DOJO_ADAPTED_OS

        arch = uname().machine
        if arch in ("x86_64", "AMD64"):
            arch = "amd64"
        else:
            arch = "arm64"

        DOJO_ADAPTED_OS = f"dojo_{data['tag_name']}_linux_{arch}.tar.gz"
        # print("DOJO_ADAPTED_OS:", DOJO_ADAPTED_OS)
        download_url = file_download_map.get(DOJO_ADAPTED_OS)
        # print("DOJO download url:", download_url)
        file_path = downloader(download_url, DOJO_ADAPTED_OS)
        print("File Path:", file_path)


def download_latest_dojoup_version():
    file_path = downloader(
        DOJOUP_BIN_URL, f"{INSTALL_DIR}dojo/dojoup")
    print("File Path:", file_path)


def install_scarb():
    tar = tarfile.open(SCARB_ADAPTED_OS)
    tar.extractall(path=INSTALL_DIR)
    try:
        rmtree(f"{INSTALL_DIR}scarb")
    except:
        pass
    move(f"{INSTALL_DIR}{SCARB_ADAPTED_OS[:-7]}", f"{INSTALL_DIR}scarb")


def install_dojo():
    tar = tarfile.open(DOJO_ADAPTED_OS)
    tar.extractall(path=f"{INSTALL_DIR}dojo/")


def downloader(url: str, save_path: str):
    file_path, _ = request.urlretrieve(
        url, save_path)
    return file_path


def set_env():
    with open(USER_PROFILE, "a") as f:
        f.write("\n")
        f.write(LINUX_ENV)
        f.write("\n")


def cleanup():
    remove(SCARB_ADAPTED_OS)
    remove(DOJO_ADAPTED_OS)
    print("RESTART your terminal to active dojo envirment")


def main():
    download_latest_scarb_version()
    install_scarb()
    download_latest_dojo_version()
    download_latest_dojoup_version()
    install_dojo()
    set_env()
    cleanup()


main()
