CADDY_VER="0.11.0"
CADDY_DIR="caddy_v${CADDY_VER}_darwin_amd64"
CADDY_ZIP="${CADDY_DIR}.zip"
CADDY_URL="https://github.com/caddyserver/caddy/releases/download/v${CADDY_VER}/${CADDY_ZIP}"
DOWNLOAD_DIR="${HOME}/Downloads"
INSTALL_PATH="${HOME}/.caddy"
PATH_DIR="/usr/local/bin"
CURR_DIR="`pwd`"

. ${SCRIPT_PATH}/common.sh

cd ${DOWNLOAD_DIR} > /dev/null

if [ -e ${CADDY_ZIP} ]; then
    output_warn "Caddy Zip file '${CADDY_ZIP}' already exists in '${DOWNLOAD_DIR}'. Deleting it."
    rm ${CADDY_ZIP} > /dev/null
fi

curl -LO ${CADDY_URL}
if [ $? != 0 ] || [ ! -e ${CADDY_ZIP} ]; then
    output_error "Could not download Caddy v${CADDY_VER}. Cannot proceed with automatic installation of caddy."
    exit 1
fi

output_success "Successfully Downloaded Caddy v${CADDY_VER} from Server. Proceeding with unzipping"

if [ -d ${CADDY_DIR} ]; then
    output_warn "Caddy Directory '${CADDY_DIR}' already exists in '${DOWNLOAD_DIR}'. Removing it."
    rm -rf ${CADDY_DIR} > /dev/null
fi

unzip ${CADDY_ZIP} -d ${CADDY_DIR}
if [ $? != 0 ]; then
    output_error "Error while unzipping '${CADDY_ZIP}'. Cannot proceed with automatic installation of caddy."
    exit 2
fi

output_success "Successfully Unzipped '${CADDY_ZIP}'. Proceeding with copying it to ${INSTALL_PATH} directory."

if [ ! -d ${INSTALL_PATH} ]; then
    output_info "${INSTALL_PATH} directory does not exist, creating it."
    mkdir ${INSTALL_PATH} > /dev/null
fi

cp -R ${CADDY_DIR} ${INSTALL_PATH} > /dev/null
if [ $? != 0 ]; then
    output_error "Error copying '${CADDY_DIR}' directory under '${INSTALL_PATH}'. Cannot proceed with automatic installation of caddy."
    exit 3
fi

output_success "Successfully copied '${CADDY_DIR}' directory under '${INSTALL_PATH}'. Proceeding with symbolic linking."

echo $PATH | grep ${PATH_DIR} > /dev/null
if [ $? != 0 ]; then
    output_error "The directory ${PATH_DIR} does not appear to be in your PATH environment variable. Cannot proceed with automatic installation of caddy."
    exit 4
fi

if [ -f ${PATH_DIR}/caddy ]; then
    output_info "The '${PATH_DIR}/caddy' Symbolic Link already exists. Deleting it."
    rm ${PATH_DIR}/caddy > /dev/null
fi

ln -s ${INSTALL_PATH}/${CADDY_DIR}/caddy ${PATH_DIR}/caddy > /dev/null

output_success "Successfully Linked '${INSTALL_PATH}/${CADDY_DIR}/caddy' to '${PATH_DIR}/caddy'. Proceeding with verification."

which caddy | grep ${PATH_DIR}/caddy
if [ $? != 0 ]; then
    output_error "Could not verify '${PATH_DIR}/caddy'. Cannot proceed with automatic installation of caddy."
    exit 6
else
    caddy --version | grep ${CADDY_VER}
    if [ $? != 0 ]; then
        output_error "Could not verify 'caddy' version '${CADDY_VER}'. Cannot proceed with automatic installation of caddy."
        exit 7
    fi
fi

output_success "Successfully Downloaded, Installed, Linked and Verified 'caddy' version '${CADDY_VER}'."
cd ${CURR_DIR}
