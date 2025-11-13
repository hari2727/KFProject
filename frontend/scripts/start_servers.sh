DIR=`pwd`
SCRIPT_PATH="`dirname $0`"

. ${SCRIPT_PATH}/common.sh

function main() {
    MODULE_NAME="${PWD##*/}"
    CADDY_PORT="3000"
    LIB_NAME="kfhub_lib"
    LIB_FULL_PATH="`real_path ${SCRIPT_PATH}`/../../${LIB_NAME}"

    if [ "`is_port_active ${CADDY_PORT}`" = "false" ]; then
        output_info "Starting ${LIB_NAME} Server"
        if [ "${MODULE_NAME}" = "${LIB_NAME}" ]; then
            npm run start:dev-local
        else
            cd ${LIB_FULL_PATH}
            npm run start:dev-local &
        fi
    else
        output_info "${LIB_NAME} Server is already running..."
    fi

    if [ "${MODULE_NAME}" != "${LIB_NAME}" ]; then
        cd ${DIR}
        output_info "Starting ${MODULE_NAME} Server"
        npm run start:dev-local
    fi
}

main "$@"
