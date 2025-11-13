DIR=`pwd`
BUILD_TRACKER_FILENAME=".kfbuild"
NG1_DIST_PATH="hgApps/"
MODULE_DIST_PATH="dist/"
LOG_PATH="logs/"
RELEASE_PATH="release/"
RUN_DATE="`date '+%Y%m%d%H%M'`"
CI_INVOKER="false"
OPTIMIZE_BUILD="true"
SOURCE_MAP="true"
NUM_PARALLEL_BUILDS=2

. ${DIR}/scripts/common.sh

DEFAULT_MODULE_LIST="${__DEFAULT_MODULE_LIST__}"
LOG_FULL_PATH="`real_path ${LOG_PATH}`"
RELEASE_FULL_PATH="`real_path ${RELEASE_PATH}`"

function build_module_app() {
    # The module app suffix was introduced to handle the kfhub_lib case
    MODULE_APP_NAME=""
    if [ "$1" == "lib" ]; then
        MODULE_APP_NAME="kfhub_lib"
    elif [ "$1" == "thclib" ]; then
        MODULE_APP_NAME="kfhub_thcl_lib"
    elif [ "$1" == "instb" ]; then    ### Ronnie: Temporary addition to handle instb for keeping both inst and instb during Feb 2020
        MODULE_APP_NAME="kfhub_inst_lib"
    else
        MODULE_APP_NAME="kfhub_$1_lib"
    fi

    LOG_FILE="$2"
    RET_VAL=0

    output_info "Starting build of Module App ${MODULE_APP_NAME}"
    if [ "${CI_INVOKER}" = "false" ]; then
        cd ../${MODULE_APP_NAME} >> ${LOG_FILE} 2>&1
    fi
    DIST_FULL_PATH="`real_path ${MODULE_DIST_PATH}`"

    output_info "Installing node dependencies for Module App ${MODULE_APP_NAME}"
    npm install >> ${LOG_FILE} 2>&1

    if [ "${USE_LOCAL_LIB}" = "true" ]; then
        output_warn "The 'use-local-lib' parameter was included, so rebuilding the kfhub_lib Project" >> ${LOG_FILE} 2>&1
        output_warn "The @kf-products-core/kfhub_lib library will be over-written with the current local kfhub_lib project contents..." >> ${LOG_FILE} 2>&1
        npm run rebuild:lib >> ${LOG_FILE} 2>&1
    fi

    if [ "${USE_LOCAL_THCLIB}" = "true" ]; then
        output_warn "The 'use-local-thclib' parameter was included, so rebuilding the kfhub_thcl_lib Project" >> ${LOG_FILE} 2>&1
        output_warn "The @kf-products-core/kfhub_thcl_lib library will be over-written with the current local kfhub_thcl_lib project contents..." >> ${LOG_FILE} 2>&1
        npm run rebuild:thclib >> ${LOG_FILE} 2>&1
    fi

    if [ "${USE_LOCAL_TATMLIB}" = "true" ]; then
        output "The 'use-local-tatmlib' parameter was included, so rebuilding the kfhub_tatm_lib Project" >> ${LOG_FILE} 2>&1
        output "The @kf-products-core/kfhub_tatm_lib library will be over-written with the current local kfhub_tatm_lib project contents..." >> ${LOG_FILE} 2>&1
        npm run rebuild:tatmlib >> ${LOG_FILE} 2>&1
    fi

    # No need to sync the shared libraries with kfhub_lib since they are hosted in that directory
    if [ "$1" != "lib" ]; then
        output_info "Syncing shared less files with Module App ${MODULE_APP_NAME}"
        npm run sync >> ${LOG_FILE} 2>&1
    fi

    if [ -e dist ]; then
        output_info "Output directory dist/ already exists. Removing it..."
        rm -rf dist > /dev/null 2>&1
    fi

    output_info "Building for Prod and Optimizing for Module App ${MODULE_APP_NAME}"
    if [ "${OPTIMIZE_BUILD}" = "false" ]; then
        output_info "Performing build:no-optimize..."
        npm run build:no-optimize >> ${LOG_FILE} 2>&1
    elif [ "${SOURCE_MAP}" = "false" ]; then
        output_info "Performing build:no-sourcemap..."
        npm run build:no-sourcemap >> ${LOG_FILE} 2>&1
    else
        output_info "Performing build..."
        npm run build >> ${LOG_FILE} 2>&1
    fi

    if [ -d ${DIST_FULL_PATH} ]; then
        output_success "Successfully built App ${MODULE_APP_NAME}"

        # Re-create the Release '/app' directory if it is not found
        if [ ! -d ${RELEASE_FULL_PATH}/app ]; then
            mkdir -p ${RELEASE_FULL_PATH}/app >> ${LOG_FILE} 2>&1
        fi

        MODULE_RELEASE_PATH="${RELEASE_FULL_PATH}/app/$1"

        if [ -d ${MODULE_RELEASE_PATH} ]; then
            rm -rf ${MODULE_RELEASE_PATH} >> ${LOG_FILE} 2>&1
        fi

        # Create the module release path under the '/app' directory
        mkdir -pv ${MODULE_RELEASE_PATH} >> ${LOG_FILE} 2>&1

        output_info "Releasing App ${MODULE_APP_NAME} to ${MODULE_RELEASE_PATH}"
        cp -rpvf ${DIST_FULL_PATH}/* ${MODULE_RELEASE_PATH} >> ${LOG_FILE} 2>&1
        # Remove any local instances of the assets/ and languages/ directories as they are shared now
        rm -rvf ${MODULE_RELEASE_PATH}/assets >> ${LOG_FILE} 2>&1

        output_success "Successfully Released App ${MODULE_APP_NAME} to ${MODULE_RELEASE_PATH}"
    else
        output_error "Failed to build App ${MODULE_APP_NAME}"
        RET_VAL=1
    fi

    if [ "${CI_INVOKER}" = "false" ]; then
        cd ${DIR} >> ${LOG_FILE} 2>&1
    fi
    echo ${RET_VAL}
}

function build_assets() {
    SOURCE="$1"
    MODULE_APP_NAME="kfhub_lib"
    SOURCE_PATH="`real_path ../${MODULE_APP_NAME}/src/${SOURCE}`"
    MODULE_RELEASE_PATH="${RELEASE_FULL_PATH}/app"
    TARGET_PATH="${MODULE_RELEASE_PATH}/${SOURCE}"
    LOG_FILE="$2"
    RET_VAL=0

    # Remove the target path under the 'app' directory if it already exists
    if [ -d ${TARGET_PATH} ]; then
        rm -rf ${TARGET_PATH} >> ${LOG_FILE} 2>&1
    fi

    # Create the target path under the '/app' directory
    mkdir -pv ${TARGET_PATH} >> ${LOG_FILE} 2>&1

    output_info "Releasing ${SOURCE} to ${MODULE_RELEASE_PATH}"
    cp -rpvf ${SOURCE_PATH} ${MODULE_RELEASE_PATH} >> ${LOG_FILE} 2>&1

    # Remove all the env.<env>.json files from the released assets directory
    find ${MODULE_RELEASE_PATH}/${SOURCE}/config -name env.*.json -exec rm -rf {} \; >> ${LOG_FILE} 2>&1

    output_success "Successfully Released Assets"

    echo ${RET_VAL}
}

function build_index() {
    SOURCE="$1"
    MODULE_APP_NAME="kfhub_lib"
    # The following lines will copy the root-index.html in the 'kfhub_lib/scripts/' directory to the 'kfhub_lib/release/' as index.html
    # This is the main index.html that performs the initial routing to the 'app/home' main angular app.
    if [ ! -d ${RELEASE_FULL_PATH}/app ]; then
        mkdir -p ${RELEASE_FULL_PATH}/app >> ${LOG_FILE} 2>&1
    fi
    SOURCE="`real_path ../${MODULE_APP_NAME}/scripts`/root-index.html"
    TARGET="`real_path ../${MODULE_APP_NAME}/release`/index.html"
    cp -rpvf ${SOURCE} ${TARGET} >> ${LOG_FILE} 2>&1

    output_success "Successfully Released Index"
}

function build_app() {
    if [ "$1" = "assets" ]; then
        LOG_FILE="${LOG_FULL_PATH}/kfhub_assets_${RUN_DATE}.log"
        output_set_file ${LOG_FILE}
        RET="$(build_assets $1 ${LOG_FILE})"
    elif [ "$1" = "index" ]; then
        LOG_FILE="${LOG_FULL_PATH}/kfhub_index_${RUN_DATE}.log"
        output_set_file ${LOG_FILE}
        RET="$(build_index $1 ${LOG_FILE})"
    else
        LOG_FILE="${LOG_FULL_PATH}/kfhub_$1_${RUN_DATE}.log"
        output_set_file ${LOG_FILE}
        RET="$(build_module_app "$1" ${LOG_FILE})"
    fi
    echo "$1|${RET}|${LOG_FILE}"
}

function main() {
    USE_LOCAL_LIB="false"
    USE_LOCAL_THCLIB="false"
    USE_LOCAL_TATMLIB="false"
    CL_ARGS="$@"
    if [ "${CL_ARGS}" = "" ]; then
        output_warn "You did not pass any parameters, so assuming build all."
        CL_ARGS="${DEFAULT_MODULE_LIST} assets index"
    else
        BAD_ARGS=""
        for ARG in "$@"; do
            if [ "$(is_valid_module "${ARG}")" == "true" ]; then
                MODULE_ARGS="${MODULE_ARGS}${ARG} "
            else
                case ${ARG} in
                    "assets" | "index")
                        MODULE_ARGS="${MODULE_ARGS}${ARG} "
                        ;;
                    "use-local-lib")
                        USE_LOCAL_LIB="true"
                        ;;
                    "use-local-thclib")
                        USE_LOCAL_THCLIB="true"
                        ;;
                    "use-local-tatmlib")
                        USE_LOCAL_TATMLIB="true"
                        ;;
                    "ci-invoker")
                        CI_INVOKER="true"
                        ;;
                    "no-optimize")
                        OPTIMIZE_BUILD="false"
                        ;;
                    "no-sourcemap")
                        SOURCE_MAP="false"
                        ;;
                    *)
                        BAD_ARGS="${BAD_ARGS}${ARG} "
                        ;;
                esac
            fi
        done

        if [ "${BAD_ARGS}" != "" ]; then
            output_error "Cannot perform configuration deployment for these arguments ${BAD_ARGS}. Aborting..."
            IS_SHOW_USAGE="true"
        fi
    fi

    if [ "${MODULE_ARGS}" = "" ]; then
        MODULE_ARGS="${DEFAULT_MODULE_LIST} assets index"
    fi

    output_info ""
    output_info "Re-Building for modules ${MODULE_ARGS}..."
    output_info "RUN ID: ${RUN_DATE}"
    output_info ""
    output_info "You may view the logs for this run by typing in the following command(s) in another terminal:"
    output_info ""
    output_info "    tail -f logs/kfhub_<module-name>_${RUN_DATE}.log"
    output_info ""
    output_info "Example for tarc: tail -f logs/kfhub_tarc_${RUN_DATE}.log"

    USE_LOCAL_LIB_PARAM=""
    if [ "${USE_LOCAL_LIB}" = "true" ]; then
        USE_LOCAL_LIB_PARAM="use-local-lib"
        output_warn ""
        output_warn "You have used the use-local-lib parameter,"
        output_warn "hence the current local version kfhub_lib will be installed for all modules."
        output_warn "Pre-building kfhub_lib for using in the other modules"
        npm run rebuild:lib
        output_success "Completed Pre-building kfhub_lib. Now resuming the building of the following modules in parallel: ${MODULE_ARGS}"
    fi

    USE_LOCAL_THCLIB_PARAM=""
    if [ "${USE_LOCAL_THCLIB}" = "true" ]; then
        USE_LOCAL_THCLIB_PARAM="use-local-thcllib"
        output_warn ""
        output_warn "You have used the use-local-thclib parameter,"
        output_warn "hence the current local version kfhub_thcl_lib will be installed for all modules."
        output_warn "Pre-building kfhub_thcl_lib for using in the other modules"
        npm run rebuild:thclib ${USE_LOCAL_LIB_PARAM}
        output_info "Completed Pre-building kfhub_thcl_lib. Now resuming the building of the following modules in parallel: ${MODULE_ARGS}"
    fi

    USE_LOCAL_TATMLIB_PARAM=""
    if [ "${USE_LOCAL_TATMLIB}" = "true" ]; then
        USE_LOCAL_TATMLIB_PARAM="use-local-tatmlib"
        output ""
        output "You have used the use-local-tatmlib parameter,"
        output "hence the current local version kfhub_tatm_lib will be installed for all modules."
        output "Pre-building kfhub_tatm_lib for using in the other modules"
        npm run rebuild:tatmlib ${USE_LOCAL_LIB_PARAM} ${USE_LOCAL_THCLIB_PARAM}
        output "Completed Pre-building kfhub_tatm_lib. Now resuming the building of the following modules in parallel: ${MODULE_ARGS}"
    fi

    # Create the log files directory, if it does not exist
    if [ ! -d ${LOG_FULL_PATH} ]; then
        mkdir -p ${LOG_FULL_PATH}
    fi

    # If Release directory does not exist then create it
    if [ -d ${RELEASE_FULL_PATH} ]; then
        mkdir -p ${RELEASE_FULL_PATH}
    fi

    # Remove the Return Value Tracker File if it already exists
    RETVAL_TRACKER_FILE="${LOG_FULL_PATH}/retval.tracker"
    if [ -f ${RETVAL_TRACKER_FILE} ]; then
        rm -f ${RETVAL_TRACKER_FILE}
    fi

    # Remove the New Line from the Command Line Arguments passed to main
    ARGS=`echo "${MODULE_ARGS}" | tr " " "\n"`
    # Export the needed variables and functions that will used by the commands run by xargs
    export DIR BUILD_TRACKER_FILENAME RELEASE_FULL_PATH LOG_FULL_PATH RETVAL_TRACKER_FILE USE_LOCAL_LIB USE_LOCAL_THCLIB USE_LOCAL_TATMLIB
    export NG1_DIST_PATH MODULE_DIST_PATH RUN_DATE CI_INVOKER OPTIMIZE_BUILD SOURCE_MAP
    # export -f build_hub_app build_module_app build_assets build_index build_app
    export -f build_module_app build_assets build_index build_app
    # Run the build_app function parallely for all modules the names of which are passed as parameters
    printf "${ARGS}" | xargs -n 1 -P ${NUM_PARALLEL_BUILDS} -I {} bash -c 'RET=$(build_app "$1"); echo "${RET}" >> ${RETVAL_TRACKER_FILE}' _ {}

    # Read the Return Value Tracker file to see if any of the build_app invocations had return value of 1
    ERRORS="`awk -F"|" '$2 ~ /1/{print}' logs/retval.tracker`"
    # If any errors found in the Return Value Tracker file, then display the errors and exit
    if [ "${ERRORS}" != "" ]; then
        while read -r ERROR; do
            MODULE="`echo ${ERROR} | cut -d'|' -f1`"
            LOG_FILE="`echo ${ERROR} | cut -d'|' -f3`"
            output_error "There was an error while building module '${MODULE}'. Please check the log file '${LOG_FILE}' for details"
            cat ${LOG_FILE}
        done <<< "${ERRORS}"
    else
        output_success "Successfully completed releasing '${MODULE_ARGS}' to ${RELEASE_FULL_PATH}"
        output_success "You could run the released application by running it with the following command: 'npm run start:release'"
        output_success "This usually runs on port 8080, unless it is already occupied in which case it picks the next available port."
    fi

    # Remove the Return Value Tracker File for this run
    # if [ -f ${RETVAL_TRACKER_FILE} ]; then
    #     rm -rf ${RETVAL_TRACKER_FILE}
    # fi

    # If errors found, then proceed no further
    if [ "${ERRORS}" != "" ]; then
        return 1
    fi
}

main "$@"
