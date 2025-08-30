package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

func httpJSONPost(url string, body []byte) (map[string]interface{}, int, error) {
	resp, err := http.Post(url, "application/json", bytes.NewReader(body))
	if err != nil {
		return nil, 0, err
	}
	defer resp.Body.Close()
	data, _ := io.ReadAll(resp.Body)
	var out map[string]interface{}
	_ = json.Unmarshal(data, &out)
	return out, resp.StatusCode, nil
}

func httpJSONGet(url string) (map[string]interface{}, int, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, 0, err
	}
	defer resp.Body.Close()
	data, _ := io.ReadAll(resp.Body)
	var out map[string]interface{}
	_ = json.Unmarshal(data, &out)
	return out, resp.StatusCode, nil
}
