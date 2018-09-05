

export default function sendRequest({
  address,
  method,
  authorizationToken,
  body,
  failureHandler,
  successHandler,
  errorHandler,
  responseHandlerNoJson
}) {
  var headers = authorizationToken !== null && authorizationToken !== undefined
                ? {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": ("Token " + authorizationToken)
                  }
                : {
                    "Content-Type": "application/json; charset=utf-8"
                  };

  var params = body !== null && body !== undefined
               ? {
                   method: method,
                   mode: "cors",
                   headers: headers,
                   body: JSON.stringify(body)
                 }
               : {
                   method: method,
                   mode: "cors",
                   headers: headers
                 };


  if (responseHandlerNoJson !== null && responseHandlerNoJson !== undefined) {
    fetch("https://www.api.bridge-uni.com/" + address, params)
      .then(res => responseHandlerNoJson(res))
  }
  else {
    fetch("https://www.api.bridge-uni.com/" + address, params)
      .then(res => res.status < 400 ? res.json() : null)
      .then(
        (result) => {
          console.log("Got result:");
          console.log(result);

          if (result === null || result === undefined) {
            if (failureHandler !== null && failureHandler !== undefined) failureHandler();
            return;
          }

          if (successHandler !== null && successHandler !== undefined) successHandler(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("Got error:");
          console.log(error);

          if (errorHandler !== null && errorHandler !== undefined) errorHandler(error);
        }
      )
  }
}
