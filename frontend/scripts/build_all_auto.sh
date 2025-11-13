DIR=`pwd`
RELEASE_TRACKER_FILEBASE=".kfrelease-"
REMOTE_NAME="origin"
#BRANCH_NAME="develop-v2"
LOG_PATH="logs/"
AWS_PROFILE_NAME="kfawsdeployerec2"
SCRIPT_LOCK_THRESHOLD="7200" # 2 Minutes in Seconds, this is the threshold to check for long running scripts

. ${DIR}/scripts/common.sh

LOG_FULL_PATH="`real_path ${LOG_PATH}`"
RETVAL_TRACKER_FILE="${LOG_FULL_PATH}/retval.tracker"
RELEASE_PATH='./release'
RELEASE_FULLPATH="`real_path ${RELEASE_PATH}`"
SCRIPT_LOCK_FILE="${LOG_FULL_PATH}/build_all_auto.lock"

function is_instance_running() {
    RET_VAL="false"
    if [ -f ${SCRIPT_LOCK_FILE} ]; then
        RET_VAL="true"
    fi
    echo ${RET_VAL}
}

function get_running_time() {
    TIME_DIFF="unknown"
    if [ -f ${SCRIPT_LOCK_FILE} ]; then
        INIT_TIME="`cat ${SCRIPT_LOCK_FILE}`"
        CURR_TIME="`date +%s`"
        TIME_DIFF="$(( ${CURR_TIME} - ${INIT_TIME} ))"
    fi
    echo ${TIME_DIFF}
}

function mark_run_start() {
    if [ ! -d ${LOG_FULL_PATH} ]; then
        mkdir ${LOG_FULL_PATH}
    fi
    date +%s > ${SCRIPT_LOCK_FILE}
}

function mark_run_complete() {
    if [ -f ${SCRIPT_LOCK_FILE} ]; then
        rm -f ${SCRIPT_LOCK_FILE}
    fi
}

function is_app_recently_tagged() {
    RET_VAL="false"
    MODULE_NAME="kfhub_app"
    MODULE_PATH="../${MODULE_NAME}"
    MODULE_FULLPATH="`real_path ${MODULE_PATH}`"
    RELEASE_TRACKER_FILENAME="${RELEASE_TRACKER_FILEBASE}app"
    RELEASE_TRACKER_FULLPATH="${RELEASE_FULLPATH}/${RELEASE_TRACKER_FILENAME}"

    cd ${MODULE_FULLPATH}
    CURRENT_TAG="`get_latest_git_tag`"
    PREVIOUS_TAG="`get_previous_git_tag ${RELEASE_TRACKER_FULLPATH}`"
    cd ${DIR}

    if [ "${PREVIOUS_TAG}" = "unavailable" ]; then
        output_warn "${MODULE_NAME} previous release information is missing. Evaluating the modules and sources that need to be released."
        RET_VAL="true"
    elif [ "${CURRENT_TAG}" != "${PREVIOUS_TAG}" ]; then
        output_warn "${MODULE_NAME} tag changed from ${PREVIOUS_TAG} to ${CURRENT_TAG}. Evaluating the modules and sources that need to be released."
        RET_VAL="true"
    fi

    echo ${RET_VAL}
}

function get_recently_tagged_modules() {
    RELEASE_MODULE_ARGS=""
    CL_ARGS="home tarc tacq tamg arch payh conf clmg odct pdct inst instb sjpr lib hub"
    for ARG in ${CL_ARGS}; do
        MODULE_NAME="`get_module_name ${ARG}`"
        MODULE_PATH="../${MODULE_NAME}"
        MODULE_FULLPATH="`real_path ${MODULE_PATH}`"
        RELEASE_TRACKER_FILENAME="${RELEASE_TRACKER_FILEBASE}${ARG}"
        RELEASE_TRACKER_FULLPATH="${RELEASE_FULLPATH}/${RELEASE_TRACKER_FILENAME}"

        cd ${MODULE_FULLPATH}
        CURRENT_TAG="`get_latest_git_tag`"
        PREVIOUS_TAG="`get_previous_git_tag ${RELEASE_TRACKER_FULLPATH}`"
        cd ${DIR}

        if [ "${PREVIOUS_TAG}" = "unavailable" ]; then
            output_warn "${MODULE_NAME} previous release information is missing. Including in this release."
            RELEASE_MODULE_ARGS="${RELEASE_MODULE_ARGS} ${ARG}"
        elif [ "${CURRENT_TAG}" != "${PREVIOUS_TAG}" ]; then
            output_warn "${MODULE_NAME} tag changed from ${PREVIOUS_TAG} to ${CURRENT_TAG}. Including in this release."
            RELEASE_MODULE_ARGS="${RELEASE_MODULE_ARGS} ${ARG}"
        else
            output_info "${MODULE_NAME} tag has not changed from ${CURRENT_TAG}. Skipping from this Release..."
        fi

        if [ "${RELEASE_MODULE_ARGS}" != "" ]; then
            cd ${MODULE_PATH}
            BRANCH_NAME="`git branch | grep \* | cut -d ' ' -f2`"
            output_info "Pulling the sources for ${MODULE_NAME} from git '${BRANCH_NAME}' branch"
            git fetch ${REMOTE_NAME} ${BRANCH_NAME} > /dev/null
            git reset --hard HEAD > /dev/null
            git clean -f -d > /dev/null
            git pull ${REMOTE_NAME} ${BRANCH_NAME} > /dev/null
            cd ${DIR}
        fi
    done
    echo ${RELEASE_MODULE_ARGS}
}

function get_recently_tagged_sources() {
    RELEASE_SOURCE_ARGS=""
    CL_ARGS="assets languages"
    for ARG in ${CL_ARGS}; do
        MODULE_NAME="${ARG}"
        MODULE_PATH="./src/${MODULE_NAME}"
        MODULE_FULLPATH="`real_path ${MODULE_PATH}`"
        cd ${MODULE_FULLPATH}
        BRANCH_NAME="`git branch | grep \* | cut -d ' ' -f2`"
        RELEASE_TRACKER_FILENAME="${RELEASE_TRACKER_FILEBASE}${ARG}"
        RELEASE_TRACKER_FULLPATH="${RELEASE_FULLPATH}/${RELEASE_TRACKER_FILENAME}"
        IS_SOURCE_CHANGED="`is_recently_changed ${MODULE_FULLPATH} ${RELEASE_TRACKER_FULLPATH}`"
        if [ "${IS_SOURCE_CHANGED}" = "true" ]; then
            output_warn "${MODULE_NAME} files have changed. Including in this release."
            RELEASE_SOURCE_ARGS="${RELEASE_SOURCE_ARGS} ${ARG}"
            output_info "Pulling the sources for ${MODULE_NAME} from git '${BRANCH_NAME}' branch"
            git fetch ${REMOTE_NAME} ${BRANCH_NAME} > /dev/null
            git reset --hard HEAD > /dev/null
            git clean -f -d > /dev/null
            git pull ${REMOTE_NAME} ${BRANCH_NAME} > /dev/null
        else
            output_info "${MODULE_NAME} source files have not changed. Skipping from this Release..."
        fi
        cd ${DIR}
    done
    echo ${RELEASE_SOURCE_ARGS}
}

function mark_released_modules() {
    RELEASE_MODULE_ARGS="$1"
    for ARG in ${RELEASE_MODULE_ARGS}; do
        MODULE_NAME="`get_module_name ${ARG}`"
        MODULE_PATH="../${MODULE_NAME}"
        MODULE_FULLPATH="`real_path ${MODULE_PATH}`"
        RELEASE_TRACKER_FILENAME="${RELEASE_TRACKER_FILEBASE}${ARG}"
        RELEASE_TRACKER_FULLPATH="${RELEASE_FULLPATH}/${RELEASE_TRACKER_FILENAME}"
        cd ${MODULE_FULLPATH}
        mark_released ${RELEASE_TRACKER_FULLPATH}
        cd ${DIR}
    done
}

function mark_built_sources() {
    RELEASE_SOURCE_ARGS="$1"
    for ARG in ${RELEASE_SOURCE_ARGS}; do
        MODULE_NAME="${ARG}"
        MODULE_PATH="./src/${MODULE_NAME}"
        MODULE_FULLPATH="`real_path ${MODULE_PATH}`"
        RELEASE_TRACKER_FILENAME="${RELEASE_TRACKER_FILEBASE}${ARG}"
        RELEASE_TRACKER_FULLPATH="${RELEASE_FULLPATH}/${RELEASE_TRACKER_FILENAME}"
        cd ${MODULE_FULLPATH}
        mark_built ${MODULE_FULLPATH} ${RELEASE_TRACKER_FULLPATH}
        cd ${DIR}
    done
}

function mark_released_app() {
    MODULE_NAME="kfhub_app"
    MODULE_PATH="../${MODULE_NAME}"
    MODULE_FULLPATH="`real_path ${MODULE_PATH}`"
    RELEASE_TRACKER_FILENAME="${RELEASE_TRACKER_FILEBASE}app"
    RELEASE_TRACKER_FULLPATH="${RELEASE_FULLPATH}/${RELEASE_TRACKER_FILENAME}"
    cd ${MODULE_FULLPATH}
    mark_released ${RELEASE_TRACKER_FULLPATH}
    cd ${DIR}
}

function invoke_build_all_script() {
    RELEASE_ARGS="$1"
    ${DIR}/scripts/build_all.sh ${RELEASE_ARGS}

    ERRORED_MODULES=""
    if [ -f ${RETVAL_TRACKER_FILE} ]; then
        # Read the Return Value Tracker file to see if any of the build_app invocations had return value of 1
        ERRORS="`awk -F"|" '$2 ~ /1/{print}' ${RETVAL_TRACKER_FILE}`"
        # If any errors found in the Return Value Tracker file, then display the errors and exit
        if [ "${ERRORS}" != "" ]; then
            while read -r ERROR; do
                MODULE="`echo ${ERROR} | cut -d'|' -f1`"
                LOG_FILE="`echo ${ERROR} | cut -d'|' -f3`"
                ERRORED_MODULES="${ERRORED_MODULES}${MODULE} "
                output_error "There was an error while building module '${MODULE}'. Please check the log file '${LOG_FILE}' for details."
            done <<< "${ERRORS}"
        fi
    fi

    echo ${ERRORED_MODULES}
}

function get_released_modules() {
    RELEASE_MODULE_ARGS="$1"
    ERRORED_MODULES="$2"
    RELEASE_SUCCESS_ARGS="${RELEASE_MODULE_ARGS}"
    for ERRORED_MODULE in ${ERRORED_MODULES}; do
        RELEASE_SUCCESS_ARGS="${RELEASE_SUCCESS_ARGS/${ERRORED_MODULE} /}"
    done
    echo "${RELEASE_SUCCESS_ARGS}"
}

function is_tools_missing() {
    RET_VAL="false"

    IS_SHOW_AWS_CONFIG_MSG="false"
    AWS_TOOL="aws"
    which ${AWS_TOOL} > /dev/null
    if [ "$?" != "0" ]; then
        output_error ""
        output_error "AWS CLI tool appears to be missing. Install it by typing the following the steps in these pages:"
        output_error "    Windows - https://docs.aws.amazon.com/cli/latest/userguide/awscli-install-windows.html"
        output_error "    MacOS   - https://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html"
        output_error "    Linux   - https://docs.aws.amazon.com/cli/latest/userguide/awscli-install-linux.html"
        IS_SHOW_AWS_CONFIG_MSG="true"
        RET_VAL="true"
    else
        aws configure --profile ${AWS_PROFILE_NAME} list > /dev/null
        if [ "$?" != "0" ]; then
            output_error ""
            output_error "It does not look like you have configured the AWS tool for the profile ${AWS_PROFILE_NAME}"
            IS_SHOW_AWS_CONFIG_MSG="true"
            RET_VAL="true"
        fi
    fi

    if [ "${IS_SHOW_AWS_CONFIG_MSG}" = "true" ]; then
        output_error ""
        output_error "If AWS CLI is installed, please configure the tool by typing the following in a terminal:"
        output_error "    aws configure --profile ${AWS_PROFILE_NAME}"
        output_error "Please enter the appropriate values for Access Key Id, Secret Access Key and Default Region"
    fi

    IS_SHOW_NODEMAILER_CONFIG_MSG="false"
    if [ "${SMTP_SERVER}" = "" ]; then
        output_error ""
        output_error "Email tool does not appear to be configured. You need to provide at least the SMTP_SERVER for non-authenticated"
        output_error "SMTP Servers using the standard port, otherwise you need to prodvide additional environment variable information"
        IS_SHOW_NODEMAILER_CONFIG_MSG="true"
        RET_VAL="true"
    else
        if [ "`system_env`" = "Mac" ]; then
            ping -c 1 ${SMTP_SERVER} > /dev/null 2>&1
        else
            ping -n 1 ${SMTP_SERVER} > /dev/null 2>&1
        fi

        if [ "$?" != "0" ]; then
            output_info ""
            output_info "Unable to reach the SMTP Server ${SMTP_SERVER} that you setup in the environment variable SMTP_SERVER."
            IS_SHOW_NODEMAILER_CONFIG_MSG="true"
            RET_VAL="true"
        fi
    fi

    if [ "${IS_SHOW_NODEMAILER_CONFIG_MSG}" = "true" ]; then
        output_info ""
        output_info "Please configure nodemailer by entering the following environment variables:"
        output_info "    SMTP_SERVER       - The hostname of the SMTP server to be used."
        output_info "    SMTP_PORT         - The port on the SMTP server that should be connected to."
        output_info "    SMTP_USERNAME     - The username to use when authenticating."
        output_info "    SMTP_PASSWORD     - The password to use when authenticating."
        output_info "    SMTP_USE_SSL      - Set this to a truth-y value to use SSL."
        output_info "    SMTP_USE_TLS      - Set this to a truth-y value to use TLS (STARTTLS)."
        output_info "    SMTP_SERVICE_NAME - This is one of nodemailer's service identifiers, if you want it to configure itself automatically."
    fi

    echo ${RET_VAL}
}

function main() {
    if [ "`is_instance_running`" = "true" -a "$1" != "force" ]; then
        RUNNING_TIME="`get_running_time`"
        if [ "${RUNNING_TIME}" != "unknown" -a ${RUNNING_TIME} -ge ${SCRIPT_LOCK_THRESHOLD} ]; then
            output_error "The previous instance of the build_all_auto.sh script has been running for ${RUNNING_TIME} seconds."
            output_error "Please check and make sure that the process is not stuck at a step."
        else
            output_error "Another instance of the build_all_auto.sh script is already running. Terminating..."
        fi
        exit 1
    elif [ "`is_tools_missing`" = "true" ]; then
        exit 2
    else
        mark_run_start
    fi

    IS_APP_RECENTLY_TAGGED="`is_app_recently_tagged`"
    if [ "${IS_APP_RECENTLY_TAGGED}" = "true" -o "$1" = "force" ]; then
        RELEASE_MODULE_ARGS="`get_recently_tagged_modules`"
        RELEASE_SOURCE_ARGS="`get_recently_tagged_sources`"
        RELEASE_ARGS="${RELEASE_MODULE_ARGS} ${RELEASE_SOURCE_ARGS}"

        if [ ! -f "${RELEASE_FULLPATH}/app/index.html" ]; then
            output_warn "app/index.html is missing. Including in this release."
            RELEASE_ARGS="${RELEASE_ARGS} index"
        else
            output_info "app/index.html exists. Skipping from this Release..."
        fi

        # Combine the list of Modules and Sources (assets, languages) and index to be rebuilt into one variable
        ERRORED_MODULES=""
        RELEASE_ARGS="`echo ${RELEASE_ARGS} | tr -s ' ' | sed 's/^ *//'`"
        if [ "${RELEASE_ARGS}" != "" ]; then
            ERRORED_MODULES="`invoke_build_all_script "${RELEASE_ARGS}"`"
        fi

        # If successfully released, then go through the list of modules and source that were released and mark as released/built etc.
        if [ -d ${RELEASE_FULLPATH} ]; then
            RELEASED_MODULE_ARGS="`get_released_modules "${RELEASE_MODULE_ARGS}" "${ERRORED_MODULES}"`"
            mark_released_modules "${RELEASED_MODULE_ARGS}"
            mark_built_sources "${RELEASE_SOURCE_ARGS}"
        fi

        mark_released_app
    fi

    mark_run_complete
}

main "$@"
