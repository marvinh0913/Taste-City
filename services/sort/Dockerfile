# ─── Stage 1: compile ─────────────────────────────────────────────────
# Uses the same Debian version as the run stage, so the compiled program
# links against the same C library (glibc) it will run with
FROM debian:bookworm-slim AS build

# Install the C compiler and standard library headers, then delete the
# package index so it doesn't take up space in this stage
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libc6-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src

# Copy only the source files the program needs
COPY main.c sort_server.c sort_server.h cJSON.c cJSON.h ./

# Compile with optimizations (-O2) and all common warnings shown (-Wall)
RUN gcc -O2 -Wall -o sort_server main.c sort_server.c cJSON.c

# ─── Stage 2: run ─────────────────────────────────────────────────────
# Start fresh: the final image has the compiled program but no compiler
FROM debian:bookworm-slim

# Don't run as root
RUN useradd --create-home appuser

# Copy just the compiled program from the build stage
COPY --from=build /src/sort_server /usr/local/bin/sort_server

USER appuser

EXPOSE 5527

# /usr/local/bin is on the PATH, so the program runs by name
CMD ["sort_server"]