# web3-storage-upload-file-action

Upload a file to [web3.storage](https://web3.storage).

## Usage

```yaml
steps:
  - uses: filecoin-station/web3-storage-upload-file-action@v0
    id: upload
    with:
      path: path-to-file.txt
      private-key: ${{ secrets.PRIVATE_KEY }}
      proof: ${{ secrets.PROOF }}
  - run: |
      echo "cid: ${{ steps.upload.outputs.cid }}"
```

See https://web3.storage/docs/how-to/upload/#bring-your-own-delegations for
creating credentials.
