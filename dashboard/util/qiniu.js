import * as qiniu from 'qiniu-js';
import {
    getUploadToken
} from '../api/photo';

let uploadToken = '';

export function uploadFile (file, fileName, cbObject) {
    let cb = () => {
        let observable = qiniu.upload(file, fileName, uploadToken, {
            fname: file.name,
            mineType: ["image/png", "image/jpeg"]
        }, {
            region: qiniu.region.z0
        });
        let subscription = observable.subscribe(cbObject)
    }
    if (!uploadToken) {
        getUploadToken().then(res => {
            if (res.data.code === 200) {
                uploadToken = res.data.data;
                cb();
            }
        })
    } else {
        cb();
    }

}