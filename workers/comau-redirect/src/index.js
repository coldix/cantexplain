/**
 * 301 every request to the matching path on the canonical host.
 * Author: Colin Dixon
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);
    return Response.redirect(`https://cantexplain.au${url.pathname}${url.search}`, 301);
  },
};
