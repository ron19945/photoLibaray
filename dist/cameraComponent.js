"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _captureImage = require("../utils/captureImage");
var _apiHelper = require("../utils/apiHelper");
var _useCamera = require("../hooks/useCamera");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const CameraComponent = _ref => {
  var _videoRef$current, _videoRef$current2, _videoRef$current3;
  let {
    onComplete,
    apiEndpoint
  } = _ref;
  const [uploading, setUploading] = (0, _react.useState)(false);
  const {
    videoRef,
    pictures,
    currentStep,
    steps,
    startCamera,
    stopCamera,
    takePicture,
    reset,
    isComplete
  } = (0, _useCamera.useCamera)();
  const handleCapture = async () => {
    const imageData = (0, _captureImage.captureImage)(videoRef.current);
    takePicture(imageData);
    if (isComplete) {
      stopCamera();
      setUploading(true);
      try {
        // Send photos to the API endpoint
        const response = await (0, _apiHelper.sendPhotosToAPI)(apiEndpoint, pictures);
        console.log("Photos uploaded successfully:", response);

        // Notify parent application
        if (onComplete) {
          onComplete(pictures, response);
        }
      } catch (error) {
        console.error("Failed to upload photos:", error);
      } finally {
        setUploading(false);
      }
    }
  };
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("video", {
    ref: videoRef,
    autoPlay: true,
    playsInline: true,
    style: {
      width: "100%",
      height: "auto"
    }
  }), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("button", {
    onClick: startCamera,
    disabled: Boolean((_videoRef$current = videoRef.current) === null || _videoRef$current === void 0 ? void 0 : _videoRef$current.srcObject)
  }, "Start Camera"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: handleCapture,
    disabled: isComplete || !((_videoRef$current2 = videoRef.current) !== null && _videoRef$current2 !== void 0 && _videoRef$current2.srcObject) || uploading
  }, uploading ? "Uploading..." : isComplete ? "Done" : "Capture ".concat(steps[currentStep])), /*#__PURE__*/_react.default.createElement("button", {
    onClick: stopCamera,
    disabled: !((_videoRef$current3 = videoRef.current) !== null && _videoRef$current3 !== void 0 && _videoRef$current3.srcObject) || uploading
  }, "Stop Camera"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: reset,
    disabled: uploading
  }, "Reset")));
};
var _default = exports.default = CameraComponent;