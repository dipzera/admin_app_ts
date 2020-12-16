export interface IAntUpload {
    file: {
        uid: string;
        name: string;
        status: "done" | "uploading" | "error" | "removed";
        response: string;
        linkProps: string;
        xhr: XMLHttpRequest;
        originFileObj: any;
    };
    fileList: any;
    event: any;
}
