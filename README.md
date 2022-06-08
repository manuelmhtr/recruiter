# Recruiter

Tools to find great developers in Github.

## Usage

Run the main script:

```sh
$ yarn run find-devs -q <some query> -o <output file>
```

Options available

| Parameter | Type | Description |
|-----------|------|-------------|
|`-q` or `--query`|String|The base query for Github to find desired users.|
|`-o` or `--output`|String|A file path to write the results.|

## Sample queries

**Most followed users in Mexico**: `location:mexico sort:followers-desc`
