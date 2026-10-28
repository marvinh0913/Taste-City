#ifndef SORT_SERVER_H
#define SORT_SERVER_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cJSON.h"

// Sorting Types Enum
typedef enum {
    ALPHA,
    CHRONO,
    NUMBER
} Type;

// Function Declarations
char* sort(const char* json_body);
void sort_numbers(int* array, int array_len);
void sort_alpha(char** array, int array_len);
char* make_null_term_string(int length);
char** parse_strings(const cJSON* items, int array_len);
char* sort_objects(const cJSON* items, int array_len, const char* sortKey);
int* parse_integers(const cJSON* items, int array_len);
char* parse(const char* body);
int test_gtest();

#endif // SORT_SERVER_H
