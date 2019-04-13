import React, { Component } from 'react'
import RUG from 'react-upload-gallery'
import axios from 'axios'


class App extends Component {

    customRequest({ uid, file, send, action, headers, onProgress, onSuccess, onError }) {
        const form = new FormData();

        // send file 
        form.append('file', file)

        const CancelToken = axios.CancelToken
        const source = CancelToken.source()       

        axios.post(
            action,
            form,
            {
                headers: {
                    'x-access-token' : 'xxxx'
                },
                onUploadProgress: ({ total, loaded }) => {
                    onProgress(uid, Math.round(loaded / total * 100));
                },
                cancelToken: source.token
            }
        ).then(({ data: response }) => {
            onSuccess(uid, response);
        })
        .catch(error => {
            onError(uid, {
                action,
                status: error.request,
                response: error.response
            })
        })
        
        return {
            abort() {
                source.cancel()
            }
        }
    }

    render() {
        return <RUG
            action="/api/upload"
            customRequest={this.customRequest}
        />
    }
}

export default App