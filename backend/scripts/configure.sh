RELEASE_DIRECTORY="release"
ENVIRONMENTS_DIRECTORY="environments"

function configure() {
    if [ "${1}" = "" ]; then
        echo "No environment was specified. So the default env file would be used."

        ENVIRONMENT_SOURCE="env.json"
        ENVIRONMENT_TARGET="${RELEASE_DIRECTORY}/env.json"
        ENVIRONMENT_SOURCE_DR="env-dr.json"
        ENVIRONMENT_TARGET_DR="${RELEASE_DIRECTORY}/env-dr.json"

        if [ ! -f "${ENVIRONMENT_SOURCE}" ]; then
            ENVIRONMENT_SOURCE="env.yml"
            ENVIRONMENT_TARGET="${RELEASE_DIRECTORY}/env.yml"
            ENVIRONMENT_SOURCE_DR="env-dr.yml"
            ENVIRONMENT_TARGET_DR="${RELEASE_DIRECTORY}/env-dr.yml"
        fi

    else

        ENVIRONMENT_SOURCE="${ENVIRONMENTS_DIRECTORY}/env.${1}.json"
        ENVIRONMENT_TARGET="${RELEASE_DIRECTORY}/env.json"
        ENVIRONMENT_SOURCE_DR="${ENVIRONMENTS_DIRECTORY}/env.${1}-dr.json"
        ENVIRONMENT_TARGET_DR="${RELEASE_DIRECTORY}/env-dr.json"

        if [ ! -f "${ENVIRONMENT_SOURCE}" ]; then
            ENVIRONMENT_SOURCE="${ENVIRONMENTS_DIRECTORY}/env.${1}.yml"
            ENVIRONMENT_TARGET="${RELEASE_DIRECTORY}/env.yml"
            ENVIRONMENT_SOURCE_DR="${ENVIRONMENTS_DIRECTORY}/env.${1}-dr.yml"
            ENVIRONMENT_TARGET_DR="${RELEASE_DIRECTORY}/env-dr.yml"
        fi

        if [ -f "${ENVIRONMENT_SOURCE}" ]; then
            echo "The '${ENVIRONMENT_SOURCE}' secure-env file would be used."
        fi
    fi

    if [ -f "${ENVIRONMENT_SOURCE}" ]; then
        echo "Copying ${ENVIRONMENT_SOURCE} to ${ENVIRONMENT_TARGET}"
        cp ${ENVIRONMENT_SOURCE} ${ENVIRONMENT_TARGET} > /dev/null 2>&1
    else
        echo "Can't find env file"
        echo $ENVIRONMENT_SOURCE
        echo ""
        ls -al
        exit 1;
    fi

    if [ -f "${ENVIRONMENT_SOURCE_DR}" ]; then
        echo "Copying ${ENVIRONMENT_SOURCE_DR} to ${ENVIRONMENT_TARGET_DR}"
        cp ${ENVIRONMENT_SOURCE_DR} ${ENVIRONMENT_TARGET_DR} > /dev/null 2>&1
    fi

    echo ""
}

configure "$@"
