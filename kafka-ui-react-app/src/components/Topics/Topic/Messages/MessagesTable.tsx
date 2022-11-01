import PageLoader from 'components/common/PageLoader/PageLoader';
import { Table } from 'components/common/table/Table/Table.styled';
import TableHeaderCell from 'components/common/table/TableHeaderCell/TableHeaderCell';
import { TopicMessage } from 'generated-sources';
import React, { useContext } from 'react';
import {
  getTopicMessges,
  getIsTopicMessagesFetching,
} from 'redux/reducers/topicMessages/selectors';
import TopicMessagesContext from 'components/contexts/TopicMessagesContext';
import { useAppSelector } from 'lib/hooks/redux';
import { Button } from 'components/common/Button/Button';
import handleNextPageClick from 'components/Topics/Topic/MessagesV2/utils/handleNextPageClick';
import { ConsumingMode } from 'lib/hooks/api/topicMessages';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MESSAGES_PER_PAGE } from 'lib/constants';
import * as S from 'components/common/NewTable/Table.styled';

import Message from './Message';

const MessagesTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLive } = useContext(TopicMessagesContext);
  const navigate = useNavigate();

  const messages = useAppSelector(getTopicMessges);
  const isFetching = useAppSelector(getIsTopicMessagesFetching);

  const mode = searchParams.get('m') as ConsumingMode;

  const isTailing = mode === 'live' && isFetching;

  // Pagination is disabled in live mode, also we don't want to show the button
  // if we are fetching the messages or if we are at the end of the topic
  const isPaginationDisabled =
    isTailing || isFetching || !searchParams.get('seekTo');

  const isNextPageButtonDisabled =
    isPaginationDisabled ||
    messages.length < Number(searchParams.get('perPage') || MESSAGES_PER_PAGE);
  const isPrevPageButtonDisabled =
    isPaginationDisabled || !searchParams.get('page');

  const handleNextPage = () =>
    handleNextPageClick(messages, searchParams, setSearchParams);

  return (
    <>
      <Table isFullwidth>
        <thead>
          <tr>
            <TableHeaderCell> </TableHeaderCell>
            <TableHeaderCell title="Offset" />
            <TableHeaderCell title="Partition" />
            <TableHeaderCell title="Timestamp" />
            <TableHeaderCell title="Key" />
            <TableHeaderCell title="Value" />
            <TableHeaderCell> </TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {messages.map((message: TopicMessage) => (
            <Message
              key={[
                message.offset,
                message.timestamp,
                message.key,
                message.partition,
              ].join('-')}
              message={message}
            />
          ))}
          {isFetching && isLive && !messages.length && (
            <tr>
              <td colSpan={10}>
                <PageLoader />
              </td>
            </tr>
          )}
          {messages.length === 0 && !isFetching && (
            <tr>
              <td colSpan={10}>No messages found</td>
            </tr>
          )}
        </tbody>
      </Table>
      <S.Pagination>
        <S.Pages>
          <Button
            buttonType="secondary"
            buttonSize="L"
            disabled={isPrevPageButtonDisabled}
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
          <Button
            buttonType="secondary"
            buttonSize="L"
            disabled={isNextPageButtonDisabled}
            onClick={handleNextPage}
          >
            Next →
          </Button>
        </S.Pages>
      </S.Pagination>
    </>
  );
};

export default MessagesTable;
