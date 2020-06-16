let fetch;
if (!process.env.BROWSER) {
  fetch = require('node-fetch');
} else {
  fetch = window.fetch;
}

class CognitiveFaceService {
  static subscriptionKey = '75e66bae510f44e3bce8035780785103';
  static subscriptionKey2 = 'c3586e6f88eb491185dce9bf2fdcc9e1';
  static uriBase =
    'https://westcentralus.api.cognitive.microsoft.com/face/v1.0';
  static params = {
    returnFaceId: 'true',
    returnFaceLandmarks: 'false',
    // returnFaceAttributes:
    //   'age,gender,headPose,smile,facialHair,glasses,' +
    //   'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
  };

  // Detect human faces in an image, return face rectangles, and optionally with faceIds, landmarks, and attributes.
  static async detectFromUrl(imageUrl) {
    let input = new URL(this.uriBase + '/detect');
    for (const key in this.params) {
      input.searchParams.append(key, this.params[key]);
    }

    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      },
      body: JSON.stringify({ url: imageUrl }),
    };
    const httpResponse = await fetch(input, init);
    const jsonResponse = await httpResponse.json();
    return jsonResponse;
  }

  static async detectFromBlob(blob) {
    // Browser only, nodejs doesn't suppoort blobs
    let input = new URL(this.uriBase + '/detect');
    for (const key in this.params) {
      input.searchParams.append(key, this.params[key]);
    }
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      },
      body: blob,
    };
    const httpResponse = await fetch(input, init);
    const jsonResponse = await httpResponse.json();

    return jsonResponse;
  }

  static async detectFromDataUrl(b64Str) {
    // Server only, nodejs Buffer type for testing
    // remove header parts
    const data = b64Str.replace(/^data:image\/\w+;base64,/, '');
    const bufferData = new Buffer(data, 'base64');

    let input = new URL(this.uriBase + '/detect');
    for (const key in this.params) {
      input.searchParams.append(key, this.params[key]);
    }
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      },
      body: bufferData,
    };
    const httpResponse = await fetch(input, init);
    const jsonResponse = await httpResponse.json();

    return jsonResponse;
  }

  // Verify whether two faces belong to a same person
  static async verifyFaceToFace(faceId1, faceId2) {
    let input = new URL(this.uriBase + '/verify');
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      },
      body: JSON.stringify({ faceId1, faceId2 }),
    };
    const httpResponse = await fetch(input, init);
    const jsonResponse = await httpResponse.json();
    return jsonResponse;
  }

  // Part of the login methods on client
  static async verifyFaceToUsername(faceId, username) {
    return await this.verifyFaceToPerson(faceId, '', '');
  }

  // Verify whether one face matches person
  static async verifyFaceToPerson(faceId, personId, personGroupId) {
    let input = new URL(this.uriBase + '/verify');

    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      },
      body: JSON.stringify({ faceId, personId, personGroupId }),
    };
    const httpResponse = await fetch(input, init);
    const jsonResponse = await httpResponse.json();
    return jsonResponse;
  }

  static async registerFaceToUsername(faceId, username) {
      // TODO:
      // determine if we need to create a new person group
      const response = await this.getPersonGroup('mypasstest');
      if(!response) {
        console.log('create it then');
      }
      console.log('determine if we to create a new person');
  }

  // NOTE: https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249
  // person group create TODO:
  // person group get
  static async getPersonGroup(personGroupId) {
    let input = new URL(this.uriBase + '/persongroups/' + personGroupId);
    const httpResponse = await fetch(input);
    if(httpResponse.status === 401) {
      return undefined;
    }
    const jsonResponse = await httpResponse.json();
    return jsonResponse;
  }
  // person group train TODO:
  // person group person create TODO:
  // person group person add face TODO:
  // person group person list TODO:
}

export default CognitiveFaceService;
