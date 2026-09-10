<!-- File timestamp: 2026-09-10 22:20:00 +09:00 -->
# 교사 성적 보고서 내보내기

`Study-03/commands/teacher_report.html`을 읽어 교사 성적 보고서를 CSV 또는 PDF 파일로 저장한다.

## `$ARGUMENTS` 처리

- `$ARGUMENTS`가 `csv`이면 `teacher_report.csv`로 저장한다.
- `$ARGUMENTS`가 `pdf`이면 `teacher_report.pdf`로 저장한다.
- 인자가 없으면 CSV와 PDF 중 원하는 형식을 먼저 확인한다.
- `csv,pdf` 또는 `pdf,csv`이면 두 형식을 모두 생성한다.
- 지원하지 않는 형식이면 `csv` 또는 `pdf`를 안내하고 중단한다.

## CSV 변환 규칙

- `teacher_report.html`의 학생별 성적 표를 읽는다.
- UTF-8 BOM을 사용해 한글이 깨지지 않도록 저장한다.
- 열 순서는 `순위, 학생, 점수, 백분율, 등급`으로 한다.
- 표 안의 HTML 태그를 제거하고 셀의 줄바꿈·쉼표를 CSV 규칙에 맞게 처리한다.
- 보고서에 데이터 제한이나 등급 기준이 있으면 별도 메타데이터 행 또는 별도 섹션으로 보존한다.

## PDF 변환 규칙

- `teacher_report.html`의 레이아웃과 한글 텍스트를 유지한다.
- 학생별 성적 표, 상대평가 등급, 요약 통계를 포함한다.
- 브라우저 인쇄 또는 HTML-PDF 변환 도구를 사용한다.
- PDF 변환 도구가 없으면 설치를 임의로 진행하지 말고 필요한 도구와 실행 방법을 안내한다.

## 검증

- 입력 파일 `Study-03/commands/teacher_report.html`이 존재하는지 확인한다.
- 학생 수와 출력 파일의 행 수가 일치하는지 확인한다.
- A~D 등급, 점수, 백분율이 원본 HTML과 일치하는지 확인한다.
- 빈 파일, 손상된 HTML, 누락된 표가 있으면 변환하지 말고 원인을 보고한다.
- 원본 `Study-03/commands/teacher_report.html`은 변경하지 않는다.

## 출력 형식

```text
## 내보내기 결과
- 입력: teacher_report.html
- 형식: CSV | PDF | CSV 및 PDF
- 출력 파일: 경로
- 학생 행 수: 숫자
- 검증: 성공 | 실패
```
