class PcmCaptureProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const processorOptions = options.processorOptions ?? {};

    this.frameSize = processorOptions.frameSize ?? 4096;
    this.buffer = new Float32Array(this.frameSize);
    this.bufferIndex = 0;
  }

  process(inputs) {
    const input = inputs[0];
    const channel = input?.[0];

    if (!channel || channel.length === 0) {
      return true;
    }

    let offset = 0;
    while (offset < channel.length) {
      const remaining = this.frameSize - this.bufferIndex;
      const copyCount = Math.min(remaining, channel.length - offset);

      this.buffer.set(channel.subarray(offset, offset + copyCount), this.bufferIndex);
      this.bufferIndex += copyCount;
      offset += copyCount;

      if (this.bufferIndex === this.frameSize) {
        const payload = new Float32Array(this.buffer);
        this.port.postMessage(payload, [payload.buffer]);
        this.bufferIndex = 0;
      }
    }

    return true;
  }
}

registerProcessor("pcm-capture-processor", PcmCaptureProcessor);
