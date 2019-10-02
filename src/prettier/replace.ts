export default function(code: string) {
  return code
    .replace(/!0/g, 'true')
    .replace(/!1/g, 'false')
    .replace(/void 0/g, 'undefined');
}
