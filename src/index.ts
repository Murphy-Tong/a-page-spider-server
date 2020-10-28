import * as Net from 'net';
import * as HtmlDownload from './htmlDownload';
import * as request from './utils/request';
import siteConfig from './siteConfig';

console.log(siteConfig)
console.log(request.openHtml(siteConfig.favo).then(console.log).catch(console.log))