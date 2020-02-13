export const SOCKET_PORTS = [...Array(10)].map((_, i) => 8000 + i)

// Socket events
export const INIT_ROUTES = 'INIT_ROUTES'
export const ROUTE_STATE_CHANGED = 'ROUTE_STATE_CHANGED'
export const VALIDATE_ROUTE = 'VALIDATE_ROUTE'
export const VALIDATE_ALL_ROUTE = 'VALIDATE_ALL_ROUTE'
