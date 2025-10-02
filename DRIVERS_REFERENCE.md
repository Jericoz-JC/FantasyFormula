# F1 2025 Drivers Reference

Quick reference for all driver IDs and team information.

## All Drivers (Alphabetical by Team)

### Alpine (Blue & Pink)
| Driver ID | Name | Number | Abbreviation |
|-----------|------|--------|--------------|
| `gasly` | Pierre Gasly | 10 | GAS |
| `colapinto` | Franco Colapinto | 43 | COL |

### Aston Martin (British Racing Green)
| Driver ID | Name | Number | Abbreviation |
|-----------|------|--------|--------------|
| `alonso` | Fernando Alonso | 14 | ALO |
| `stroll` | Lance Stroll | 18 | STR |

### Ferrari (Rosso Corsa Red)
| Driver ID | Name | Number | Abbreviation |
|-----------|------|--------|--------------|
| `leclerc` | Charles Leclerc | 16 | LEC |
| `hamilton` | Lewis Hamilton | 44 | HAM |

### Haas (White)
| Driver ID | Name | Number | Abbreviation |
|-----------|------|--------|--------------|
| `ocon` | Esteban Ocon | 31 | OCO |
| `bearman` | Oliver Bearman | 87 | BEA |

### Kick Sauber (Lime Green)
| Driver ID | Name | Number | Abbreviation |
|-----------|------|--------|--------------|
| `hulkenberg` | Nico Hülkenberg | 27 | HUL |
| `bortoleto` | Gabriel Bortoleto | 5 | BOR |

### McLaren (Papaya Orange)
| Driver ID | Name | Number | Abbreviation |
|-----------|------|--------|--------------|
| `piastri` | Oscar Piastri | 81 | PIA |
| `norris` | Lando Norris | 4 | NOR |

### Mercedes (Silver)
| Driver ID | Name | Number | Abbreviation |
|-----------|------|--------|--------------|
| `russell` | George Russell | 63 | RUS |
| `antonelli` | Andrea Kimi Antonelli | 12 | ANT |

### Racing Bulls (White & Blue)
| Driver ID | Name | Number | Abbreviation |
|-----------|------|--------|--------------|
| `lawson` | Liam Lawson | 30 | LAW |
| `hadjar` | Isack Hadjar | 6 | HAD |

### Red Bull Racing (Navy Blue)
| Driver ID | Name | Number | Abbreviation |
|-----------|------|--------|--------------|
| `verstappen` | Max Verstappen | 1 | VER |
| `tsunoda` | Yuki Tsunoda | 22 | TSU |

### Williams (Williams Blue)
| Driver ID | Name | Number | Abbreviation |
|-----------|------|--------|--------------|
| `albon` | Alexander Albon | 23 | ALB |
| `sainz` | Carlos Sainz | 55 | SAI |

## Current Standings (After Round 17 - Azerbaijan)

| Pos | Driver | Team | Points |
|-----|--------|------|--------|
| 1 | Oscar Piastri | McLaren | 266 |
| 2 | Lando Norris | McLaren | 250 |
| 3 | Max Verstappen | Red Bull | 185 |
| 4 | George Russell | Mercedes | 157 |
| 5 | Charles Leclerc | Ferrari | 139 |
| 6 | Lewis Hamilton | Ferrari | 109 |
| 7 | Andrea Kimi Antonelli | Mercedes | 63 |
| 8 | Yuki Tsunoda | Red Bull | 54 |
| 9 | Nico Hülkenberg | Kick Sauber | 37 |
| 10 | Esteban Ocon | Haas | 27 |
| 11 | Pierre Gasly | Alpine | 22 |
| 12 | Fernando Alonso | Aston Martin | 20 |
| 13 | Lance Stroll | Aston Martin | 20 |
| 14 | Liam Lawson | Racing Bulls | 16 |
| 15 | Alexander Albon | Williams | 16 |
| 16 | Carlos Sainz | Williams | 16 |
| 17 | Isack Hadjar | Racing Bulls | 10 |
| 18 | Oliver Bearman | Haas | 8 |
| 19 | Gabriel Bortoleto | Kick Sauber | 6 |
| 20 | Franco Colapinto | Alpine | 0 |

## Team Colors Reference

```json
{
  "McLaren": {
    "primary": "#FF8000",
    "secondary": "#000000",
    "name": "Papaya Orange"
  },
  "Red Bull Racing": {
    "primary": "#0600EF",
    "secondary": "#DC0000",
    "accent": "#FCD700",
    "name": "Navy Blue"
  },
  "Mercedes": {
    "primary": "#00D2BE",
    "secondary": "#000000",
    "accent": "#C0C0C0",
    "name": "Silver"
  },
  "Ferrari": {
    "primary": "#DC0000",
    "secondary": "#FFFFFF",
    "name": "Rosso Corsa"
  },
  "Aston Martin": {
    "primary": "#006F62",
    "secondary": "#000000",
    "name": "British Racing Green"
  },
  "Alpine": {
    "primary": "#0090FF",
    "secondary": "#FF87BC",
    "name": "Blue & Pink"
  },
  "Williams": {
    "primary": "#005AFF",
    "secondary": "#FFFFFF",
    "name": "Williams Blue"
  },
  "Haas": {
    "primary": "#FFFFFF",
    "secondary": "#000000",
    "accent": "#B6BABD",
    "name": "White"
  },
  "Kick Sauber": {
    "primary": "#00E701",
    "secondary": "#000000",
    "name": "Lime Green"
  },
  "Racing Bulls": {
    "primary": "#FFFFFF",
    "secondary": "#0600EF",
    "accent": "#DC0000",
    "name": "White & Blue"
  }
}
```

## Example Ranking Submission

```json
{
  "raceId": "uuid-of-race",
  "rankings": {
    "drivers": [
      { "position": 1, "driverId": "piastri" },
      { "position": 2, "driverId": "norris" },
      { "position": 3, "driverId": "verstappen" },
      { "position": 4, "driverId": "russell" },
      { "position": 5, "driverId": "leclerc" },
      { "position": 6, "driverId": "hamilton" },
      { "position": 7, "driverId": "tsunoda" },
      { "position": 8, "driverId": "antonelli" },
      { "position": 9, "driverId": "alonso" },
      { "position": 10, "driverId": "hulkenberg" },
      { "position": 11, "driverId": "ocon" },
      { "position": 12, "driverId": "sainz" },
      { "position": 13, "driverId": "gasly" },
      { "position": 14, "driverId": "lawson" },
      { "position": 15, "driverId": "albon" },
      { "position": 16, "driverId": "stroll" },
      { "position": 17, "driverId": "hadjar" },
      { "position": 18, "driverId": "bearman" },
      { "position": 19, "driverId": "bortoleto" },
      { "position": 20, "driverId": "colapinto" }
    ]
  }
}
```

## Notes

- Driver IDs are lowercase and must match exactly
- All 20 drivers must be included in every ranking
- Positions must be 1-20 with no duplicates
- Team assignments are current as of 2025 season

