## Intro

I am passionate about maps and i want to bring this passion into my cding career. So, This is my tech demo for a collaborative mapping platform. Collaborative Mapping is beautiful concept because it leverages the power of the community and lets them create something great. The most inspiring example is the OpenStreetMap project.

## Goals

This platform is currently the prototype for an art project that me and some friends are trying to bring into life. We want to collect and share stories surrounding the Berlin Wall. We plan to make the platform public by mid 2024.

## Tech stack

- ReactJS/NextJS (Frontend/Backend)
- Typescript (Typing)
- leaflet/react-leaflet/react-leaflet-draw (interactive maps)
- Firestore (DB)

the app is build in nextjs using firebase as a db. for the maps leaflet.js was used and react-leaflet.js for integration into react. I specifically wanted to opt for the open source library instead of Google maps even though this presented some technical downsides: react-leaflet does not allow JSX inside popups which limits a lot what you can do with them inside a react app.