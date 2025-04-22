import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  let apiKey = 'Test API Key'
  const cloned = req.clone({
    setHeaders: {
      'x-api-key': apiKey
    }
  });
  return next(cloned);
};
