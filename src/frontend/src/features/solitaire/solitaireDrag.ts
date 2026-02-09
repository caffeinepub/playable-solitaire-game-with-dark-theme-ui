import { DragPayload, Selection } from './solitaireTypes';

const DRAG_DATA_TYPE = 'application/x-solitaire-card';

export function serializeDragPayload(payload: DragPayload): string {
  return JSON.stringify(payload);
}

export function deserializeDragPayload(data: string): DragPayload | null {
  try {
    const parsed = JSON.parse(data);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!['waste', 'foundation', 'tableau'].includes(parsed.type)) return null;
    return parsed as DragPayload;
  } catch {
    return null;
  }
}

export function setDragData(event: React.DragEvent, payload: DragPayload): void {
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData(DRAG_DATA_TYPE, serializeDragPayload(payload));
  event.dataTransfer.setData('text/plain', serializeDragPayload(payload));
}

export function getDragData(event: React.DragEvent): DragPayload | null {
  const data = event.dataTransfer.getData(DRAG_DATA_TYPE) || event.dataTransfer.getData('text/plain');
  if (!data) return null;
  return deserializeDragPayload(data);
}

export function dragPayloadToSelection(payload: DragPayload): Selection {
  return {
    type: payload.type,
    index: payload.index,
    cardIndex: payload.cardIndex,
  };
}

export function validateDragSource(
  payload: DragPayload,
  wasteLength: number,
  foundations: unknown[][],
  tableau: unknown[][]
): boolean {
  if (payload.type === 'waste') {
    return wasteLength > 0;
  }
  
  if (payload.type === 'foundation') {
    if (payload.index === undefined || payload.index < 0 || payload.index >= 4) return false;
    return foundations[payload.index].length > 0;
  }
  
  if (payload.type === 'tableau') {
    if (payload.index === undefined || payload.index < 0 || payload.index >= 7) return false;
    if (payload.cardIndex === undefined || payload.cardIndex < 0) return false;
    return payload.cardIndex < tableau[payload.index].length;
  }
  
  return false;
}
