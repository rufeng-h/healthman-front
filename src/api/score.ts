import { defHttp } from './../utils/http/axios/index';
enum Api {
  BaseUrl = '/api/score',
  UploadScore = '/api/score/upload',
}

export function uploadScore(file: File, msId: number | undefined, name = 'file'): Promise<number> {
  return defHttp.uploadFile(
    { url: Api.UploadScore, params: { msId } },
    { file, name },
    { errorMessageMode: 'message' },
  );
}
