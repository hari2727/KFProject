__OUTPUT_FILE__=""
# List the modules for kfhub here. Try to form a new line for any new entries
__NG1_MODULE__="hub"
__LIBRARY_MODULE_LIST__="lib thcl tatm"
__DEFAULT_MODULE_LIST__="$(echo $(cat <<- ENDVAR-DML
    ${__LIBRARY_MODULE_LIST__}
    arch clmg conf inst instb odct payh pdct sjpr tacq tamg tarc
ENDVAR-DML
) | tr '\r\n' ' ' | tr -s ' ')"

function get_tput_color() {
    TPUT_COLOR="0"
    case $1 in
        "BLACK")   TPUT_COLOR="0";;
        "RED")     TPUT_COLOR="1";;
        "GREEN")   TPUT_COLOR="2";;
        "YELLOW")  TPUT_COLOR="3";;
        "BLUE")    TPUT_COLOR="4";;
        "MAGENTA") TPUT_COLOR="5";;
        "CYAN")    TPUT_COLOR="6";;
        "WHITE")   TPUT_COLOR="7";;
    esac
    echo "${TPUT_COLOR}"
}

function output_set_file() {
    __OUTPUT_FILE__="$1"
}

function output_msg() {
    TIMESTAMP_COLOR="`tput setab 3`"
    TPUT_FG_COLOR=`get_tput_color $1`
    MSG_COLOR=`tput setaf ${TPUT_FG_COLOR}`
    RESET=`tput sgr0`
    DATE=" `date '+%Y-%m-%d %H:%M:%S'` "
    if [ "${__OUTPUT_FILE__}" = "" ]; then
        echo "${TIMESTAMP_COLOR}${DATE}${RESET} ${MSG_COLOR}$2${RESET}" >&2
    else
        echo "${DATE} $2" >> ${__OUTPUT_FILE__}
    fi
}

function output_error() {
    output_msg "RED" "$1"
}

function output_warn() {
    output_msg "YELLOW" "$1"
}

function output_success() {
    output_msg "GREEN" "$1"
}

function output_info() {
    output_msg "CYAN" "$1"
}

function system_env() {
    UNAME_OUT="$(uname -s)"
    MACHINE="UNKNOWN:${UNAME_OUT}"
    case "${UNAME_OUT}" in
        Linux*)     MACHINE=Linux;;
        Darwin*)    MACHINE=Mac;;
        CYGWIN*)    MACHINE=Cygwin;;
        MINGW*)     MACHINE=MinGw;;
    esac
    echo ${MACHINE}
}

function get_last_updated() {
    if [ "`system_env`" = "Mac" ]; then
        find $1 -type f -exec stat -f '%m %N' "{}" \; | sort -n | tail -1
    else
        find $1 -type f -printf "%T@ %p\n" | sort -n | tail -1
    fi
}

function is_valid_module() {
    if [[ ${__DEFAULT_MODULE_LIST__} = *$1* ]]; then
        echo "true"
    else
        echo "false"
    fi
}

function is_valid_library() {
    if [[ ${__LIBRARY_MODULE_LIST__} = *$1* ]]; then
        echo "true"
    else
        echo "false"
    fi
}

function is_recently_done() {
    CURR_BUILD_INFO="`get_last_updated $1`"
    PREV_BUILD_INFO=""
    if [ -f $2 ]; then
        PREV_BUILD_INFO="`cat $2`"
    fi

    if [ "$CURR_BUILD_INFO" = "$PREV_BUILD_INFO" ]; then
        echo "true"
    else
        echo "false"
    fi
}

function is_recently_changed() {
    RECENTLY_DONE="`is_recently_done $1 $2`"
    if [ "${RECENTLY_DONE}" = "true" ]; then
        echo "false"
    else
        echo "true"
    fi
}

function is_recently_built() {
    is_recently_done $1/src $2
}

function mark_built() {
    get_last_updated $1 > $2
}

function real_path() {
    # I am not proud of this function, but stupid Mac machines don't make it easy to do this in a uniform way...
    DIR="`pwd`"
    if [ ! -d $1 ]; then
        mkdir $1
        cd $1
        REAL_PATH="`pwd`"
        cd ${DIR}
        rmdir $1
    else
        cd $1
        REAL_PATH="`pwd`"
        cd ${DIR}
    fi
    echo "${REAL_PATH}"
}

function is_port_active() {
    which netstat > /dev/null
    if [ "$?" = "0" ]; then
        netstat -ant | grep "$1" | grep "LISTEN" > /dev/null
        if [ "$?" = "0" ]; then
            echo "true"
        else
            echo "false"
        fi
    else
        ps -ef | grep "caddy -conf caddyfile" | grep -v "grep" > /dev/null
        if [ "$?" = "0" ]; then
            echo "true"
        else
            echo "false"
        fi
    fi
}

function get_latest_git_tag() {
    if [ "$1" != "skip-pull" ]; then
        git pull > /dev/null 2>&1
    fi
    GIT_TAG="`git describe --abbrev=0 --tags 2> /dev/null`"
    if [ "$?" != "0" ]; then
        GIT_TAG="none"
    fi
    echo ${GIT_TAG}
}

function get_previous_git_tag() {
    GIT_TAG="unavailable"
    if [ -f $1 ]; then
        GIT_TAG="`cat $1`"
    fi
    echo ${GIT_TAG}
}

function mark_released() {
    get_latest_git_tag skip-pull > $1
}

function get_package_version() {
    NM_BIN_PATH="./node_modules/.bin"
    cat $1/package.json | ${NM_BIN_PATH}/json version
}

function get_module_name() {
    MODULE_NAME="$1"
    case "$1" in
        thclib)
            MODULE_NAME="kfhub_thcl_lib";;
        lib)
            MODULE_NAME="kfhub_lib";;
        hub)
            MODULE_NAME="kfhub";;
        *)
            if [ "$(is_valid_module "$1")" == "true" ]; then
                MODULE_NAME="kfhub_$1_lib"
            fi
            ;;
    esac
    echo ${MODULE_NAME}
}

function get_json_value() {
    NM_BIN_PATH="./node_modules/.bin"
    echo $1 | ${NM_BIN_PATH}/json $3 $2
}

function get_temp_filename() {
    echo "tmpfile_$(date '+%Y%m%d%H%M%S%s')_${RANDOM}.tmp"
}

function make_partial_env_file() {
    INPUT_FILENAME="$1"
    shift
    OUTPUT_FILENAME="$1"
    shift
    IS_KEEP_FILTER_ITEMS="$1"
    shift
    FILTER_ITEMS="$@"
    export INPUT_FILENAME OUTPUT_FILENAME IS_KEEP_FILTER_ITEMS FILTER_ITEMS
    node << MPEF-EOF
        fs = require('fs')
        const inputFilename = process.env.INPUT_FILENAME;
        const outputFilename = process.env.OUTPUT_FILENAME;
        const isKeepFilterItems = process.env.IS_KEEP_FILTER_ITEMS === 'true';
        const filterItems = process.env.FILTER_ITEMS;
        const sourceString = fs.readFileSync(inputFilename, { encoding:'utf8', flag:'r' }); 
        const source = JSON.parse(sourceString);
        const filteredOutput = {}
        Object.keys(source).filter((key) => {
            if ((isKeepFilterItems && filterItems.includes(key)) || (!isKeepFilterItems && !filterItems.includes(key))) {
                filteredOutput[key] = source[key];
            }
        });
        fs.writeFileSync(outputFilename, JSON.stringify(filteredOutput));
MPEF-EOF
}

export __OUTPUT_FILE__  __NG1_MODULE__  __LIBRARY_MODULE_LIST__  __DEFAULT_MODULE_LIST__
export -f get_tput_color  output_msg output_error  output_warn  output_success  output_info  output_set_file  real_path
