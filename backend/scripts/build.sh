function get_temp_filename() {
    echo "tmpfile_$(date '+%Y%m%d%H%M%S%s').tmp"
}

function get_temp_dirname() {
    echo "tmpdir_$(date '+%Y%m%d%H%M%S%s')"
}

mkdir -p /tmp

RELEASE_DIRECTORY="release"
CERTS_DIRECTORY="certs"

function build() {
    ENVIRONMENT_SOURCE="$1"

    if [ -e "${RELEASE_DIRECTORY}" ]; then
        echo "Cleaning the '${RELEASE_DIRECTORY}' directory."
        rm -rf ${RELEASE_DIRECTORY} > /dev/null 2>&1
    fi

    echo "Starting Compilation using tsc compiler."
    TMP_FILENAME="/tmp/`get_temp_filename`"
    npm run tsc > ${TMP_FILENAME} 2>&1
    if [ "$?" = "1" ]; then
        echo "There were errors during compilation..."
        echo "`cat ${TMP_FILENAME}`"
        rm -rf ${TMP_FILENAME} > /dev/null 2>&1
        return
    fi
    rm -rf ${TMP_FILENAME} > /dev/null 2>&1
    echo "Compilation was successful."

    echo "Copying package.json to '${RELEASE_DIRECTORY}' directory."
    cp package.json ${RELEASE_DIRECTORY} > /dev/null 2>&1

    if [ -e ${CERTS_DIRECTORY} ]; then
        echo "Copying ${CERTS_DIRECTORY} to '${RELEASE_DIRECTORY}/' directory."
        cp -R ${CERTS_DIRECTORY} ${RELEASE_DIRECTORY} > /dev/null 2>&1
    fi

    echo "Build Completed Successfully. The Release Files are available under the '${RELEASE_DIRECTORY}' directory."
}

build "$@"
