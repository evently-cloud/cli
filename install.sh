#!/bin/bash
{
    set -e
    SUDO=''
    if [ "$(id -u)" != "0" ]; then
      SUDO='sudo'
      echo "This script requires superuser access."
      echo "You will be prompted for your password by sudo."
      # clear any previous sudo permission
      sudo -k
    fi


    # run inside sudo
    $SUDO bash <<SCRIPT
  set -e

  echoerr() { echo "\$@" 1>&2; }

  if [[ ! ":\$PATH:" == *":/usr/local/bin:"* ]]; then
    echoerr "Your path is missing /usr/local/bin, you need to add this to use this installer."
    exit 1
  fi

  if [ "\$(uname)" == "Darwin" ]; then
    OS=darwin
  elif [ "\$(expr substr \$(uname -s) 1 5)" == "Linux" ]; then
    OS=linux
  else
    echoerr "This installer is only supported on Linux and MacOS"
    exit 1
  fi

  ARCH="\$(uname -m)"
  if [ "\$ARCH" == "x86_64" ]; then
    ARCH=x64
  elif [[ "\$ARCH" == aarch* ]]; then
    ARCH=arm
  else
    echoerr "unsupported arch: \$ARCH"
    exit 1
  fi

  mkdir -p /usr/local/lib
  cd /usr/local/lib
  rm -rf evently
  rm -rf ~/.local/share/evently/client
  if [ \$(command -v xz) ]; then
#  TODO On build, upload version-free, hash-free files for this script
    URL=https://s3.eu-central-003.backblazeb2.com/evently-cli\$OS-\$ARCH.tar.xz
    TAR_ARGS="xJ"
  else
    URL=https://s3.eu-central-003.backblazeb2.com/evently-cli\$OS-\$ARCH.tar.gz
    TAR_ARGS="xz"
  fi
  echo "Installing CLI from \$URL"
  if [ \$(command -v curl) ]; then
    curl "\$URL" | tar "\$TAR_ARGS"
  else
    wget -O- "\$URL" | tar "\$TAR_ARGS"
  fi
  # delete old evently bin if exists
  rm -f \$(command -v evently) || true
  rm -f /usr/local/bin/evently
  ln -s /usr/local/lib/evently/bin/evently /usr/local/bin/evently

  # on alpine (and maybe others) the basic node binary does not work
  # remove our node binary and fall back to whatever node is on the PATH
  /usr/local/lib/evently/bin/node -v || rm /usr/local/lib/evently/bin/node

SCRIPT
  # test the CLI
  LOCATION=$(command -v evently)
  echo "evently installed to $LOCATION"
  evently version
}

# based on https://github.com/heroku/cli/blob/master/install-standalone.sh
# May 18, 2021   4ec5848