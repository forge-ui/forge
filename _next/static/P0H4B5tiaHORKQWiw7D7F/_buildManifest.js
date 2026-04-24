self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [
      {
        "source": "/forge//_next/:path+",
        "destination": "/forge/_next/:path+"
      }
    ],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()