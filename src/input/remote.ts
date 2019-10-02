import fetch from 'node-fetch';

export default async function() {
  const codejs = (await fetch('https://www.majsoul.com/1/version.json').then(
    data => data.json()
  ))['code'];

  return await fetch(`https://www.majsoul.com/1/${codejs}`).then(data =>
    data.text()
  );
}
