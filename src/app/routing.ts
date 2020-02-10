import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable()
export class CustomReuseStrategy implements RouteReuseStrategy {
    routesToCache: string[] = [];
    routesNotToCache: string[] = ['org/:id', 'blog/:blog'];
    storedRouteHandles = new Map<string, DetachedRouteHandle>();

    // Decides if the route should be stored
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
       return this.routesToCache.indexOf(route.routeConfig.path) > -1;
    }

    // Store the information for the route we're destructing
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
       this.storedRouteHandles.set(route.routeConfig.path, handle);
    }

   // Return true if we have a stored route object for the next route
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
       return this.storedRouteHandles.has(route.routeConfig.path);
    }

    // If we returned true in shouldAttach(), now return the actual route data for restoration
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
       return this.storedRouteHandles.get(route.routeConfig.path);
    }

    // Reuse the route if we're going to and from the same route
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
       const route = future.routeConfig && future.routeConfig.path;
       return future.routeConfig === curr.routeConfig && !this.routesNotToCache.includes(route);
    }
   }
