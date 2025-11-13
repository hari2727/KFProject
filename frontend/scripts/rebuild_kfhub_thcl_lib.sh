DIR=`pwd`
SCRIPT_PATH="`dirname $0`"
LIB_NAME="kfhub_thcl_lib"
MODULE_NAME="${PWD##*/}"

. ${SCRIPT_PATH}/common.sh

function rebuild_library() {
    NPM_SCOPE="@kf-products-core"
    LIB_FULL_PATH="`real_path ${SCRIPT_PATH}/../../${LIB_NAME}`"
    PKG_FULL_PATH="${LIB_FULL_PATH}/last-build"
    FQ_LIB_NAME="${NPM_SCOPE}/${LIB_NAME}"
    BUILD_TRACKER_FILENAME="${LIB_FULL_PATH}/.kfbuild"
    REBUILD_MARKER_FULLPATH="${LIB_FULL_PATH}/.${LIB_NAME}-rebuild.marker"

    if [ -f ${REBUILD_MARKER_FULLPATH} -a "$1" != "force" ]; then
        output_warn "It looks like another build of the ${LIB_NAME} library is actively being performed."
        output_warn "You may either press CTRL+C to exit out of this or let this continue to run."
        output_warn "This script will resume once the active build has completed."

        while [ -f ${REBUILD_MARKER_FULLPATH} ]; do
            sleep 5
        done

        output_success "The active build appears to have completed"
        if [ -d ${LIB_FULL_PATH}/last-build ]; then
            output_success "and the build was successful, Resuming this build..."
        else
            output_error "however the build appears to have failed, aborting this build!"
            exit 1
        fi
    fi

    cd ${LIB_FULL_PATH}

    if [ ! -d node_modules ]; then
        output_info "Installing node dependencies for ${LIB_NAME}"
        npm install
    fi

    if [ "${USE_LOCAL_LIB}" = "true" ]; then
        output_warn "The 'use-local-lib' parameter was included, so rebuilding the kfhub_lib Project"
        output_warn "The @kf-products-core/kfhub_lib library will be over-written with the current local kfhub_lib project contents..."
        npm run rebuild:lib
    fi

     cd $DIR

    IS_REBUILD_REQUIRED="false"
    if [ "$1" == "force" ]; then
        output_warn "User has forced a rebuild, so rebuilding ${LIB_NAME}..."
        IS_REBUILD_REQUIRED="true"
    elif [ ! -d ${PKG_FULL_PATH} ]; then
        output_warn "Library Package distribution directory '${PKG_FULL_PATH}' is missing, so rebuilding ${LIB_NAME}..."
        IS_REBUILD_REQUIRED="true"
    elif [ "`is_recently_built ${LIB_FULL_PATH} ${BUILD_TRACKER_FILENAME}`" != "true" ]; then
        output_warn "Library Package source for ${LIB_NAME} have changed since it was last built, so rebuilding ${LIB_NAME}..."
        IS_REBUILD_REQUIRED="true"
    fi

    if [ "${IS_REBUILD_REQUIRED}" = "true" ]; then
        echo "Performing FULL Rebuild of ${LIB_NAME}. This will auto-delete once it is complete. Remove only if you know what you're doing" > ${REBUILD_MARKER_FULLPATH}
        cd ${LIB_FULL_PATH}

        output_info "Cleaning up build directories for ${LIB_NAME}"
        rm -rf .ng_pkg_build
        rm -rf dist
        rm -rf dist.tgz
        rm -rf last-build

        output_info "Creating Library Package for ${LIB_NAME}"
        npm run packagr

        if [ ! -d dist ]; then
            output_error "Error! Something went wrong, directory 'dist' is still not available"
        else
            cp -R dist last-build/
        fi

        cd $DIR

        mark_built ${LIB_FULL_PATH}/src ${BUILD_TRACKER_FILENAME}

        if [ -f ${REBUILD_MARKER_FULLPATH} ]; then
            rm -f ${REBUILD_MARKER_FULLPATH} > /dev/null 2>&1
        fi

        output_success "Created Library Package for ${LIB_NAME} successfully"
    else
        output_success "Library package for ${LIB_NAME} is current. Skipping rebuild..."
    fi

    PUBLISH_PKG_VERSION="`get_package_version ${PKG_FULL_PATH}`"
    PKG_FULLNAME="${NPM_SCOPE}/${LIB_NAME}@${PUBLISH_PKG_VERSION}"

    if [ "${MODULE_NAME}" = "${LIB_NAME}" ]; then
        output_success "Library ${PKG_FULLNAME} is now available to be consumed in other modules or to be published to NPM Private Repo"
        output_success "Please run this from the root directory of one of the modules to install ${PKG_FULLNAME} as its dependency"
    else
        output_success "Installing Library ${LIB_NAME} as a dependency of module ${MODULE_NAME}"

        if [ -d ./node_modules/${FQ_LIB_NAME} ]; then
            output_info "Removing the ./node_modules/${FQ_LIB_NAME} directory"
            rm -rf ./node_modules/${FQ_LIB_NAME}
        fi

        if [ ! -d ${PKG_FULL_PATH} ]; then
            output_error "Error! Something went wrong, ${PKG_FULL_PATH} is still not available"
        else
            if [ ! -e ./node_modules/${NPM_SCOPE} ]; then
                output_info "Creating the ./node_modules/${NPM_SCOPE} directory"
                mkdir ./node_modules/${NPM_SCOPE}
            fi

            output_info "Creating the ./node_modules/${FQ_LIB_NAME} directory"
            mkdir ./node_modules/${FQ_LIB_NAME}
            output_info "Copying package contents from ${PKG_FULL_PATH} to ./node_modules/${FQ_LIB_NAME}"
            cp -a ${PKG_FULL_PATH}/. ./node_modules/${FQ_LIB_NAME}
            rm -rf ./node_modules/${FQ_LIB_NAME}/node_modules

            output_success "Completed installation of Library ${PKG_FULLNAME} as a dependency to module ${MODULE_NAME} successfully"
        fi
    fi
}

function main() {
    USE_LOCAL_LIB="false"
    FORCE="false"
    CL_ARGS="$@"
    if [ "${CL_ARGS}" != "" ]; then
        BAD_ARGS=""
        for ARG in "$@"; do
            case ${ARG} in
                "use-local-lib")
                    USE_LOCAL_LIB="true"
                    ;;
                "force")
                    FORCE="true"
                    ;;
                *)
                    BAD_ARGS="${BAD_ARGS}${ARG} "
                    ;;
            esac
        done
        
        if [ "${BAD_ARGS}" != "" ]; then
            output_error "Cannot perform thclib build for these arguments ${BAD_ARGS}. Aborting..."
        fi
    fi

    export USE_LOCAL_LIB

    rebuild_library "$@"
}

main "$@"
