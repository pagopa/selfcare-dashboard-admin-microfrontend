# selfcare-dashboard-admin-microfrontend 

Micro-frontend developed as an extension of the [selfcare-dashboard-frontend](https://github.com/pagopa/selfcare-dashboard-frontend) using WebPack 5's module federation, in order to serve all the pages related to selfcare admin.

It shares some common model with the container app: see [selfcare-dashboard-frontend](https://github.com/pagopa/selfcare-dashboard-frontend#data-and-modeltypes-shared-with-remotes-micro-frontend) for details

## Remotes components

This micro-frontend serve the micro-components listed in this section.

### RoutingAdmin

It will configure the routing to serve all the pages related to the selfcare admin entities

This component requires the props described into [selfcare-dashboard-frontend](https://github.com/pagopa/selfcare-dashboard-frontend#props-to-configure-dashboard-micro-frontends-pages)

## To configure the workspace execute the following commands

- yarn install
- yarn generate

## To build a configured workspace execute the following command

- yarn build
