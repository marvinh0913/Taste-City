#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cJSON.h"
#include "sort_server.h"

// Global sort key used by the comparator
static const char* global_sort_key = NULL;


int test_gtest() {
    return 5;
}

void sort_numbers(int* array, int array_len) {
    for(int i = 1; i < array_len; i++) {
        int j = i;
        while(j > 0 && array[j-1] > array[j]) {
            int temp = array[j-1];
            array[j - 1] = array[j];
            array[j] = temp;
            j --;
        }
    }
}

void sort_alpha(char** array, int array_len) {
    for(int i = 1; i < array_len; i++) {
        int j = i ;
        while(j> 0 && (strcmp(array[j - 1], array[j])>0)) {
            char* temp = array[j - 1];
            array[j - 1] = array[j];
            array[j] = temp;
            j--;
        }
    }
}

char* make_null_term_string(int length) {
    char* string = (char*)malloc((length + 1)*sizeof(char));
    string[length] = '\0';
    return string;
}

char** parse_strings(const cJSON* items, int array_len) {
    // allocate memory for char** array
    char** array = (char**)malloc(array_len * sizeof(char*));
    if(array == NULL) {
        fprintf(stderr, "Failed to allocate memory for array\n");
        exit(EXIT_FAILURE);
    }
    //place the values in the array
    for(int i =0; i < array_len; i++) {
        cJSON* item = cJSON_GetArrayItem(items, i);
        if (item == NULL) {
            fprintf(stderr, "Failed to parse JSON\n");
        }
        if (!cJSON_IsString(item)) {
            fprintf(stderr, "Failed to parse JSON\n");
        }
        int string_len = strlen(item->valuestring);
        array[i] = make_null_term_string(string_len);
        char* source = item->valuestring;
        strncpy(array[i], source, string_len);
    }
    return array;
}

int* parse_integers(const cJSON* items, int array_len) {
    // allocate memory for int* array
    int* array = (int*)malloc(array_len * sizeof(int));
    if (array == NULL) {
        fprintf(stderr, "Failed to allocate memory for array\n");
        exit(EXIT_FAILURE);
    }
    //place the values in the array
    for(int i =0; i < array_len; i++) {
        cJSON* item = cJSON_GetArrayItem(items, i);
        if (item == NULL) {
            fprintf(stderr, "Failed to parse JSON\n");
        }
        if (!cJSON_IsNumber(item)) {
            fprintf(stderr, "Failed to parse JSON\n");
        }
        array[i] = item->valueint;
    }
    return array;
}

char* build_str_from_int_arr(int* arr, int size) {
    int max_digits = 10;
    int buffer_size = size * (max_digits + 1) + 1;
    char* str = (char*)malloc(buffer_size * sizeof(char));
    str[0] = '\0';
    strcat(str, "{\"numbers\" : [");

    for(int i=0; i < size; i++) {
        char temp[max_digits + 1];
        sprintf(temp, "%d", arr[i]);
        strcat(str, temp);
        if(i < size - 1) {
            strcat(str, ", ");
        } else if(i == size - 1) {
            strcat(str, "]}");
        }
    }
    return str;
}

char* build_str_from_str(char** arr, int size) {
    int max_characters = 100;
    int buffer_size = size * (max_characters + 1) + 1;
    char* str = (char*)malloc(buffer_size * sizeof(char));
    str[0] = '\0';
    strcat(str, "{\"strings\" : [");

    for(int i=0; i < size; i++) {
        char temp[max_characters + 1];
        sprintf(temp, "\"%s\"", arr[i]);
        strcat(str, temp);
        if(i < size - 1) {
            strcat(str, ", ");
        }else if(i == size - 1) {
            strcat(str, "]}");
        }
    }
    return str;
}

char* parse(const char* body) {
    cJSON* body_json = cJSON_Parse(body);
    if (body_json == NULL) {
        fprintf(stderr, "Failed to parse JSON\n");
        exit(EXIT_FAILURE);
    }

    const cJSON* type = cJSON_GetObjectItemCaseSensitive(body_json, "type");
    const cJSON* items = cJSON_GetObjectItemCaseSensitive(body_json, "items");
    int array_len = cJSON_GetArraySize(items);

    // Check if the first item is an object (full restaurant record)
    cJSON* first_item = cJSON_GetArrayItem(items, 0);
    if (first_item && cJSON_IsObject(first_item)) {
        // Extract the sortBy field from the request
        cJSON* sortBy = cJSON_GetObjectItemCaseSensitive(body_json, "sortBy");
        if (!sortBy || !cJSON_IsString(sortBy)) {
            fprintf(stderr, "Missing or invalid sortBy field\n");
            cJSON_Delete(body_json);
            exit(EXIT_FAILURE);
        }
        char* response = sort_objects(items, array_len, sortBy->valuestring);
        cJSON_Delete(body_json);
        return response;
    }

    // Fallback: handle simple strings or numbers as before
    if (strcmp("NUMBER", type->valuestring) == 0) {
        int* array = parse_integers(items, array_len);
        sort_numbers(array, array_len);
        cJSON_Delete(body_json);
        char* response = build_str_from_int_arr(array, array_len);
        return response;
    }
    if (strcmp("ALPHA", type->valuestring) == 0 || strcmp("CHRONO", type->valuestring) == 0) {
        char** array = parse_strings(items, array_len);
        sort_alpha(array, array_len);
        cJSON_Delete(body_json);
        char* response = build_str_from_str(array, array_len);
        return response;
    }

    fprintf(stderr, "Sorting type not understood\n");
    cJSON_Delete(body_json);
    exit(EXIT_FAILURE);
}

int compare_restaurants(const void* a, const void* b) {
    cJSON* objA = *(cJSON**)a;
    cJSON* objB = *(cJSON**)b;

    // Get the field from each object
    cJSON* fieldA = cJSON_GetObjectItemCaseSensitive(objA, global_sort_key);
    cJSON* fieldB = cJSON_GetObjectItemCaseSensitive(objB, global_sort_key);
    if (!fieldA || !fieldB) {
        return 0;
    }
    // If both fields are strings, compare them alphabetically
    if (cJSON_IsString(fieldA) && cJSON_IsString(fieldB)) {
        return strcmp(fieldA->valuestring, fieldB->valuestring);
    }
    // If both fields are numbers, compare numerically
    if (cJSON_IsNumber(fieldA) && cJSON_IsNumber(fieldB)) {
        if (fieldA->valuedouble < fieldB->valuedouble) return -1;
        if (fieldA->valuedouble > fieldB->valuedouble) return 1;
        return 0;
    }
    // Fallback: compare as strings if possible
    char bufferA[64], bufferB[64];
    snprintf(bufferA, sizeof(bufferA), "%s", cJSON_IsString(fieldA) ? fieldA->valuestring : "");
    snprintf(bufferB, sizeof(bufferB), "%s", cJSON_IsString(fieldB) ? fieldB->valuestring : "");
    return strcmp(bufferA, bufferB);
}

char* sort_objects(const cJSON* items, int array_len, const char* sortKey) {
    // Allocate an array of pointers to the JSON objects
    cJSON** obj_array = malloc(array_len * sizeof(cJSON*));
    if (!obj_array) {
        fprintf(stderr, "Memory allocation failed\n");
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < array_len; i++) {
        obj_array[i] = cJSON_GetArrayItem(items, i);
    }
    
    // Set the global sort key so that the comparator can use it
    global_sort_key = sortKey;
    // Sort the array using qsort and the comparator defined above
    qsort(obj_array, array_len, sizeof(cJSON*), compare_restaurants);

    // Build a new JSON array for the sorted items
    cJSON* sortedArray = cJSON_CreateArray();
    for (int i = 0; i < array_len; i++) {
        // Duplicate each object (deep copy) so that we don't affect the original
        cJSON* dup = cJSON_Duplicate(obj_array[i], 1);
        cJSON_AddItemToArray(sortedArray, dup);
    }
    free(obj_array);
    
    // Create a response object with the sorted items under "sortedItems"
    cJSON* response_obj = cJSON_CreateObject();
    cJSON_AddItemToObject(response_obj, "sortedItems", sortedArray);
    
    char* response_str = cJSON_Print(response_obj);
    // Clean up the response object since its content has been printed to a string
    cJSON_Delete(response_obj);
    return response_str;
}

char* sort(const char* json_body) {  
    return parse(json_body); 
}


