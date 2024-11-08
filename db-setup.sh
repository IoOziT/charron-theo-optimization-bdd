#!/bin/bash

pnpm exec kysely migrate:latest && pnpm exec kysely seed:run
