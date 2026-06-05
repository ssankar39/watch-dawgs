[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/VGt6djVY)
# UGA Traffic Navigator

##  Overview

This repository represents the culminating project for CSCI 4300 – Web Programming at UGA.  
Our team collaboratively designed, developed, and deployed this full-stack web application using React + Next.js, Node.js and MongoDB. 

---

## Our Team - Group_Name_Here 

| Member Name      | GitHub Username      | Role          |
|------------------|----------------------|---------------|
| Christopher      | christopherambrose   | Project Leader  |
|christopher ambrose | christopherambrose | Project Manager   |
|  Jaylen Grant    |     jay1526          | Communication Leader    |
| Sarveshwar Sankar  |       ssankar       | GitHub Captain |

---

## Project Features

- Authentication & Authorization** (login/sign-up, protected routes)  
- Route Protection** for authenticated users  
- CRUD operations** using a database or API  
- Responsive UI** & dynamic navigation bar  

---

## Repository Structure

```
/src
/app → Next.js App Router pages (frontend & API routes)
/components → AuthModal.tsx, BusBetting.tsx, BusTracker.tsx, IncidentCard.tsx,
                LocationManager.tsx, RoutePlanner.tsx, SplashScreen.tsx, TrafficAlerts.tsx
                UserProfile.tsx, TrafficMapView.tsx
/models → BusBet.ts, Location.ts, User.ts, BusLocation.ts, Incident.ts
/public → file.svg, vercel.svg, globe.svg, window.svg, next.svg
/design → mockups.md 
/status → WEEKLY_STATUS.md
```

---

## Tech Stack

| Layer             | Technology                                   |
|-------------------|----------------------------------------------|
| Frontend          | React + Next.js (App Router)                 |
| Backend           | Next.js API Routes / Node.js                 |
| Database          | MongoDB + Mongoose                           |
| Styling           | Tailwind CSS ?? / Custom CSS Modules ??      |
| Authentication    | NextAuth.js                                  |

---

## Run the development server

```
npm run dev
```

The project should now be running at:
    http://localhost:3000

## API Endpoints (Examples – update as you build)

| Method      | Endpoint             | Description            |
| ----------- | -------------------- | ---------------------- |
| GET         | /api/items           | Fetch all items        |
| POST        | /api/items           | Create a new item      |
| GET         | /api/items/[id]      | Get item by ID         |
| PUT         | /api/items/[id]      | Update item by ID      |
| DELETE      | /api/items/[id]      | Delete item by ID 
| ...         | ...                  | ... 
| ...         | ...                  | ...                    |

## Database Models (example)
User
| Field    | Type   | Description     |
| -------- | ------ | --------------- |
| name     | String | Full name       |
| email    | String | Unique email    |
| password | String | Hashed password |
| createdAt | Date | date user is created |

Incident
| Field    | Type   | Description     |
| -------- | ------ | --------------- |
| location     | String | location of incident       |
| type    | traffic, accident, etc. | type of incident    |
| severity     | low, meduim, etc. | severity of incident |
| description | String | description of incident |
| author | string | who reported incident  |
| authorId | ObjectId | id of author |
| createdAt | date | when report happened |
| updatedAt | date | when report was last updated |

BusLocation
| Field    | Type   | Description     |
| -------- | ------ | --------------- |
| busId     | String | id of bus       |
| latitude    | number | latitude of bus currently    |
| longitude     | number | longitude of bus currently |
| route | string | bus route |
| destination | string | bus destination on current route |
| lastUpdated | date | locations last update |

BusBet
| Field    | Type   | Description     |
| -------- | ------ | --------------- |
| userId     | objectId | users given id       |
| busId    | string | bus's id    |
| predictedArrival     | number | when bus is supposed to arrive |
| actualArrival | number | when it actually arrived |
| points | number | points earned from guess |
| status | pending / completed | bet finished or not |
| createdAt | date | when bet was placed |

Location
| Field    | Type   | Description     |
| -------- | ------ | --------------- |
| userId     | ObjectId | id of user who creates location       |
| name    | String | users named location    |
| latitude     | number | of saved location |
| longitude | number | of saved location |
| type | home, work,favorite,other | type selected by user |

## Client Routes 
| Route         | Description       |
| ------------- | ----------------- |
| `/`           | Splash screen          |
| `/login`      | User login        |
| `/dashboard`  | User dashboard    |
| `/dashboard/report`  | report page    |
| `/about`      | about page     |
| `/items`      | List of items     |
| `/items/[id]` | View details page |
| `/auth/login`      | full login page     |
| `/signup`      |  signup dialog      |
| `/auth/signup`      | full signup page     |




## Future Improvements
- I think implimentation with Apple Maps for iOS devices would be nice. As well as maybe several other maps, to compare and pick the absolute best routes across maps. 

## Acknowledgements
- Sarveshwar Sankar and Jaylen Grant, I think they did a great job on this and were really good partners, especially after one of ours dropped out the class, they really picked up the slack. 
