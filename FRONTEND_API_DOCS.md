# Frontend API Documentation

## Table of Contents
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Services Endpoints](#services-endpoints)
  - [Get All Services](#1-get-all-services-public)
  - [Get Service by Slug](#2-get-service-by-slug-public)
  - [Get Specific Sub-Service](#3-get-specific-sub-service-public)
- [Available Services](#available-services)
- [Error Handling](#error-responses)
- [Example Implementation](#example-frontend-implementation-react)

## Authentication
All endpoints (except public ones) require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Base URL
```
http://localhost:5050/api
```

## Services Endpoints

### 1. Get All Services (Public)
**Endpoint:** `GET /services`  
**Description:** Retrieve all available services with basic information

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "moto": "string",
      "imageUrl": "string",
      "icon": "string"
    }
  ],
  "count": 0
}
```

### 2. Get Service by Slug (Public)
**Endpoint:** `GET /services/:slug`  
**Description:** Get detailed information about a specific service including all its sub-services

**Example:**  
`GET /services/cloud-computing-migration`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "slug": "string",
    "description": "string",
    "moto": "string",
    "imageUrl": "string",
    "icon": "string",
    "subServices": [
      {
        "subServiceName": "string",
        "slug": "string",
        "moto": "string",
        "definition": "string",
        "commitment": "string",
        "organizationNeed": {
          "organizationalDefinition": "string",
          "needs": [
            {
              "title": "string",
              "description": "string"
            }
          ]
        },
        "businessValue": {
          "businessValueDefinition": "string",
          "values": [
            {
              "title": "string",
              "description": "string"
            }
          ]
        },
        "cta": {
          "title": "string",
          "description": "string"
        }
      }
    ]
  }
}
```

### 3. Get Specific Sub-Service (Public)
**Endpoint:** `GET /services/:serviceSlug/:subServiceSlug`  
**Description:** Get detailed information about a specific sub-service within a service

**Example:**  
`GET /services/cloud-computing-migration/cloud-migration`

**Response:**
```json
{
  "success": true,
  "data": {
    "service": {
      "_id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "moto": "string",
      "imageUrl": "string",
      "icon": "string"
    },
    "subService": {
      "subServiceName": "string",
      "slug": "string",
      "moto": "string",
      "definition": "string",
      "commitment": "string",
      "organizationNeed": {
        "organizationalDefinition": "string",
        "needs": [
          {
            "title": "string",
            "description": "string"
          }
        ]
      },
      "businessValue": {
        "businessValueDefinition": "string",
        "values": [
          {
            "title": "string",
            "description": "string"
          }
        ]
      },
      "cta": {
        "title": "string",
        "description": "string"
      }
    }
  }
}
```

## Available Services

### Cloud Computing & Migration
- **Slug:** `cloud-computing-migration`
- **Sub-services:**
  1. Cloud Migration (`cloud-migration`)
  2. Cloud Storage Solutions (`cloud-storage`)
  3. Multi-Cloud Strategy (`multi-cloud-strategy`)
  4. Cloud Security (`cloud-security`)
  5. Performance Optimization (`performance-optimization`)

### Managed IT Services
- **Slug:** `managed-it-services`
- **Sub-services:**
  1. Network Monitoring (`network-monitoring`)
  2. Help Desk Support (`help-desk`)
  3. IT Infrastructure Management (`it-infrastructure`)
  4. End-User Computing (`end-user-computing`)

### Cybersecurity & Risk Management
- **Slug:** `cybersecurity-risk-management`
- **Sub-services:**
  1. Security Assessment (`security-assessment`)
  2. Threat Detection & Response (`threat-detection`)
  3. Compliance Management (`compliance-management`)
  4. Security Awareness Training (`security-training`)

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Error message"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Service not found",
  "debug": {
    "searchedFor": "string",
    "availableServices": [
      {
        "name": "string",
        "slug": "string",
        "id": "string"
      }
    ]
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Example Frontend Implementation (React)

```jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/services`);
        setServices(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="services">
      <h1>Our Services</h1>
      <div className="services-grid">
        {services.map(service => (
          <div key={service._id} className="service-card">
            <img src={service.imageUrl} alt={service.name} />
            <h2>{service.name}</h2>
            <p>{service.moto}</p>
            <a href={`/services/${service.slug}`}>Learn More</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicesPage;
```

## Best Practices

1. **Error Handling**: Always handle potential errors when making API calls
2. **Loading States**: Show loading indicators while fetching data
3. **Caching**: Consider implementing client-side caching for better performance
4. **Environment Variables**: Store the API base URL in environment variables
5. **Responsive Design**: Ensure your components work well on all screen sizes

## Rate Limiting
- Public endpoints are rate limited to 100 requests per minute per IP address
- Authenticated endpoints have higher limits (500 requests/minute)
- Include proper error handling for 429 (Too Many Requests) responses
