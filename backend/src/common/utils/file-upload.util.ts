// TODO: Move to service provider
export const getComputedFileUpload = (fileUpload) => {
  if (!fileUpload?.key) {
    return null;
  }
  return {
    ...fileUpload,
    url: `https://${process.env.ASSETS_CDN_ENDPOINT}/${fileUpload.key}`,
  };
};
