import { usePermission } from '/@/hooks/web/usePermission';
const { hasPermission } = usePermission();
export function calcColWidth(authorities: string[], w = 40): number {
  let cnt = 0;
  authorities.forEach((a) => {
    if (hasPermission(a)) {
      cnt += 1;
    }
  });
  return cnt * w;
}
